/**
 * Сервис отзывов с сайта.
 * Проверки, лимит, сохранение в JSON, уведомление. Без публикации на витрину (status pending).
 */
import type { H3Event } from 'h3'
import { loggerFor } from '../utils/logger'
import { assertRequestRateLimit } from '../utils/rateLimit'
import {
  isReviewHoneypotFilled,
  parseReviewBody,
  type ReviewBody,
} from '../utils/reviewValidation'
import { siteReviewRepository } from '../repositories/siteReviewRepository'
import { notifyReviewCreated } from '../notifications'

export type ReviewSubmitData = {
  ok: true
  id?: string
}

/**
 * Принимает отзыв с формы и сохраняет его.
 * Получает: event Nitro и сырое body формы.
 * Делает: honeypot → валидация → rate limit → JSON → notify.
 * Возвращает: данные успеха. Ошибки бросает как AppError.
 */
export async function submitSiteReview(
  event: H3Event,
  body: ReviewBody | null | undefined,
): Promise<ReviewSubmitData> {
  const log = loggerFor(event)

  if (isReviewHoneypotFilled(body)) {
    log.debug('review honeypot triggered')
    return { ok: true }
  }

  const data = parseReviewBody(body)
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const requestId = event.context.requestId ?? null

  assertRequestRateLimit(`review:${ip}`)

  const saved = await siteReviewRepository.create({
    author: data.author,
    rating: data.rating,
    text: data.text,
    ip,
    requestId,
  })

  log.info('site review accepted', {
    id: saved.id,
    author: saved.author,
    rating: saved.rating,
    ip: saved.ip,
    createdAt: saved.createdAt,
  })

  await notifyReviewCreated(saved)

  return { ok: true, id: saved.id }
}
