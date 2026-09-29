/**
 * Канал уведомлений в Telegram.
 * Шлёт сообщение ботом в один или несколько чатов из env.
 */
import { config } from '../../shared/config'
import { formatDateTime } from '../../shared/time'
import { appLogger } from '../utils/logger'
import type { CallbackRequest } from '../repositories/callbackRequestRepository'
import type { SiteReview } from '../repositories/siteReviewRepository'
import type { CallbackNotifier, ReviewNotifier } from './types'

const TELEGRAM_API = 'https://api.telegram.org'
const TIMEOUT_MS = 8000

type TelegramSendResult = {
  ok?: boolean
  description?: string
}

/**
 * Проверяет, что токен бота и хотя бы один chat id заданы.
 * Получает: ничего.
 * Делает: читает config.
 * Возвращает: true, если канал можно вызывать.
 */
function isConfigured() {
  return Boolean(config.telegramBotToken && config.telegramChatIds.length)
}

/**
 * Экранирует пользовательский текст для Telegram HTML.
 * Получает: произвольную строку.
 * Делает: заменяет &, <, >.
 * Возвращает: безопасную строку.
 */
function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

/**
 * Собирает HTML-карточку заявки для Telegram.
 * Получает: сохранённую заявку.
 * Делает: заголовок, поля с иконками, телефон в <code> для копирования.
 * Возвращает: строку с parse_mode HTML.
 */
function formatCallbackHtml(request: CallbackRequest) {
  const fields = [
    `👤 <b>Имя</b>\n${escapeHtml(request.name)}`,
    `📞 <b>Телефон</b>\n<code>${escapeHtml(request.phone)}</code>`,
  ]

  if (request.title) {
    fields.push(`📝 <b>Тема</b>\n${escapeHtml(request.title)}`)
  }

  fields.push(`🕐 <b>Время</b>\n${escapeHtml(formatDateTime(request.createdAt))}`)

  return ['🔔 <b>Новая заявка</b>', ...fields].join('\n\n')
}

/**
 * Собирает HTML-карточку отзыва для Telegram.
 * Получает: сохранённый отзыв.
 * Делает: автора, оценку, текст и время.
 * Возвращает: строку с parse_mode HTML.
 */
function formatReviewHtml(review: SiteReview) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(Math.max(0, 5 - review.rating))
  return [
    '⭐ <b>Новый отзыв с сайта</b>',
    `👤 <b>Автор</b>\n${escapeHtml(review.author)}`,
    `📊 <b>Оценка</b>\n${stars} (${review.rating}/5)`,
    `💬 <b>Текст</b>\n${escapeHtml(review.text)}`,
    `🕐 <b>Время</b>\n${escapeHtml(formatDateTime(review.createdAt))}`,
  ].join('\n\n')
}

/**
 * Дергает метод Telegram Bot API.
 * Получает: имя метода и тело запроса.
 * Делает: POST с таймаутом, проверяет ok.
 * Возвращает: Promise<void>. Ошибки API бросает.
 */
async function telegramPost(method: string, body: Record<string, unknown>) {
  const url = `${TELEGRAM_API}/bot${config.telegramBotToken}/${method}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

  const payload = (await response.json().catch(() => null)) as TelegramSendResult | null
  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.description || `Telegram HTTP ${response.status}`)
  }
}

/**
 * Отправляет HTML-сообщение во все chat id из env.
 * Получает: текст сообщения.
 * Делает: sendMessage в каждый чат; агрегирует ошибки.
 * Возвращает: Promise<void>.
 */
async function broadcastHtml(text: string) {
  const results = await Promise.allSettled(
    config.telegramChatIds.map(chatId =>
      telegramPost('sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    ),
  )

  const failed = results.flatMap((result, index) => {
    if (result.status === 'fulfilled') return []
    const chatId = config.telegramChatIds[index]
    const reason = result.reason instanceof Error ? result.reason.message : String(result.reason)
    return [`${chatId}: ${reason}`]
  })

  if (failed.length) {
    throw new Error(failed.join('; '))
  }
}

/**
 * Отправляет карточку заявки и контакт с кнопкой «Позвонить».
 * Получает: chatId и заявку.
 * Делает: sendMessage, затем sendContact (tel: на inline-кнопке Telegram не принимает).
 * Возвращает: Promise<void>.
 */
async function sendCallbackToChat(chatId: string, request: CallbackRequest) {
  await telegramPost('sendMessage', {
    chat_id: chatId,
    text: formatCallbackHtml(request),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  })

  await telegramPost('sendContact', {
    chat_id: chatId,
    phone_number: `+${request.phoneDigits}`,
    first_name: request.name.trim() || 'Клиент',
  })
}

export const telegramNotifier: CallbackNotifier = {
  name: 'telegram',

  /**
   * Уведомляет админов в Telegram о новой заявке.
   * Получает: сохранённую заявку.
   * Делает: если env не задан — молча выходит; иначе шлёт во все chat id.
   * Возвращает: Promise<void>.
   */
  async notify(request) {
    if (!isConfigured()) {
      appLogger.debug('telegram notifier skipped: missing token or chat id')
      return
    }

    const results = await Promise.allSettled(
      config.telegramChatIds.map(chatId => sendCallbackToChat(chatId, request)),
    )

    const failed = results.flatMap((result, index) => {
      if (result.status === 'fulfilled') return []
      const chatId = config.telegramChatIds[index]
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason)
      return [`${chatId}: ${reason}`]
    })

    if (failed.length) {
      throw new Error(failed.join('; '))
    }
  },
}

export const telegramReviewNotifier: ReviewNotifier = {
  name: 'telegram',

  /**
   * Уведомляет админов в Telegram о новом отзыве с сайта.
   * Получает: сохранённый отзыв.
   * Делает: если env не задан — молча выходит; иначе шлёт HTML-карточку.
   * Возвращает: Promise<void>.
   */
  async notify(review) {
    if (!isConfigured()) {
      appLogger.debug('telegram review notifier skipped: missing token or chat id')
      return
    }

    await broadcastHtml(formatReviewHtml(review))
  },
}
