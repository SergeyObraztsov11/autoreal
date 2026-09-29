/**
 * Контракт уведомлений о новой заявке и отзыве.
 * Сюда подключаются Telegram, MAX, email и другие каналы — без правок хендлера.
 */
import type { CallbackRequest } from '../repositories/callbackRequestRepository'
import type { SiteReview } from '../repositories/siteReviewRepository'

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

/**
 * Канал уведомления о отзыве с сайта.
 * Получает: сохранённый отзыв.
 * Делает: отправляет сообщение во внешний сервис.
 * Возвращает: Promise<void> (ошибки канала не должны ронять отзыв — ловим снаружи).
 */
export type ReviewNotifier = {
  name: string
  notify: (review: SiteReview) => Promise<void>
}
