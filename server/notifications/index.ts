/**
 * Реестр каналов уведомлений о заявках и отзывах.
 * Новый канал = файл + запись в соответствующий список. Ошибка одного канала не роняет остальные.
 */
import { appLogger } from '../utils/logger'
import type { CallbackRequest } from '../repositories/callbackRequestRepository'
import type { SiteReview } from '../repositories/siteReviewRepository'
import type { CallbackNotifier, ReviewNotifier } from './types'
import { telegramNotifier, telegramReviewNotifier } from './telegram'

/** Подключённые каналы для заявок. */
const callbackNotifiers: CallbackNotifier[] = [
  telegramNotifier,
]

/** Подключённые каналы для отзывов. */
const reviewNotifiers: ReviewNotifier[] = [
  telegramReviewNotifier,
]

/**
 * Рассылает уведомление о новой заявке во все подключённые каналы.
 * Получает: сохранённую заявку CallbackRequest.
 * Делает: вызывает каждый notifier; ошибки канала только логирует.
 * Возвращает: Promise<void>.
 */
export async function notifyCallbackCreated(request: CallbackRequest) {
  for (const channel of callbackNotifiers) {
    try {
      await channel.notify(request)
    }
    catch (error) {
      appLogger.error('callback notification failed', {
        channel: channel.name,
        id: request.id,
        err: error instanceof Error ? error.message : String(error),
      })
    }
  }
}

/**
 * Рассылает уведомление о новом отзыве во все подключённые каналы.
 * Получает: сохранённый отзыв SiteReview.
 * Делает: вызывает каждый notifier; ошибки канала только логирует.
 * Возвращает: Promise<void>.
 */
export async function notifyReviewCreated(review: SiteReview) {
  for (const channel of reviewNotifiers) {
    try {
      await channel.notify(review)
    }
    catch (error) {
      appLogger.error('review notification failed', {
        channel: channel.name,
        id: review.id,
        err: error instanceof Error ? error.message : String(error),
      })
    }
  }
}
