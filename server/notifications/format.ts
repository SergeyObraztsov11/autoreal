/**
 * Общий текст уведомлений о заявке и отзыве.
 * Каналы (Telegram, MAX и т.д.) берут готовый текст и только доставляют его.
 */
import type { CallbackRequest } from '../repositories/callbackRequestRepository'
import type { SiteReview } from '../repositories/siteReviewRepository'
import { formatDateTime } from '../../shared/time'

/**
 * Собирает текст уведомления о новой заявке.
 * Получает: сохранённую заявку.
 * Делает: имя, телефон, тему и время в поясе приложения.
 * Возвращает: многострочную строку без разметки.
 */
export function formatCallbackText(request: CallbackRequest) {
  const lines = [
    'Новая заявка',
    '',
    `Имя: ${request.name}`,
    `Телефон: ${request.phone}`,
  ]

  if (request.title) {
    lines.push(`Тема: ${request.title}`)
  }

  lines.push(`Время: ${formatDateTime(request.createdAt)}`)
  return lines.join('\n')
}

/**
 * Собирает текст уведомления о новом отзыве с сайта.
 * Получает: сохранённый отзыв.
 * Делает: автора, оценку, текст и время в поясе приложения.
 * Возвращает: многострочную строку без разметки.
 */
export function formatReviewText(review: SiteReview) {
  return [
    'Новый отзыв с сайта',
    '',
    `Автор: ${review.author}`,
    `Оценка: ${review.rating}/5`,
    `Текст: ${review.text}`,
    `Время: ${formatDateTime(review.createdAt)}`,
  ].join('\n')
}
