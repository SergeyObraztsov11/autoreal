/**
 * Контракт уведомлений о новой заявке.
 * Сюда позже подключаются Telegram, email и другие каналы — без правок хендлера.
 */
import type { CallbackRequest } from '../repositories/callbackRequestRepository'

/**
 * Канал уведомления о заявке (Telegram, email и т.д.).
 * Получает: сохранённую заявку.
 * Делает: отправляет сообщение во внешний сервис.
 * Возвращает: Promise<void> (ошибки канала не должны ронять заявку — ловим снаружи).
 */
export type CallbackNotifier = {
  name: string
  notify: (request: CallbackRequest) => Promise<void>
}
