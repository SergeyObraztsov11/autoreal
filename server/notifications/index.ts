/**
 * Реестр каналов уведомлений о заявках.
 * Пока список пустой: добавление Telegram/email = новый файл + запись в notifiers.
 */
import { appLogger } from '../utils/logger'
import type { CallbackRequest } from '../repositories/callbackRequestRepository'
import type { CallbackNotifier } from './types'

/** Подключённые каналы. Добавляй сюда импорты при расширении. */
const notifiers: CallbackNotifier[] = [
  // example: telegramNotifier,
]

/**
 * Рассылает уведомление о новой заявке во все подключённые каналы.
 * Получает: сохранённую заявку CallbackRequest.
 * Делает: вызывает каждый notifier; ошибки канала только логирует.
 * Возвращает: Promise<void>.
 */
export async function notifyCallbackCreated(request: CallbackRequest) {
  for (const channel of notifiers) {
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
