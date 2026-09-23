/**
 * Сервис заявок на обратный звонок.
 * Бизнес-логика формы: проверки, дедуп, лимит, сохранение, уведомления.
 * HTTP-ответ не собирает — при ошибке бросает AppError, успех отдаёт данные.
 */
import type { H3Event } from 'h3'
import { loggerFor } from '../utils/logger'
import { assertRequestRateLimit } from '../utils/rateLimit'
import { isHoneypotFilled, parseRequestBody, type RequestBody } from '../utils/requestValidation'
import { callbackRequestRepository } from '../repositories/callbackRequestRepository'
import { notifyCallbackCreated } from '../notifications'

export type CallbackSubmitData = {
  ok: true
  id?: string
  duplicate?: boolean
}

/**
 * Принимает заявку с формы и проводит её по правилам сервиса.
 * Получает: event Nitro и сырое body формы.
 * Делает: honeypot → валидация → дедуп → rate limit → JSON → notify.
 * Возвращает: данные успеха. Ошибки бросает как AppError (или обычный Error при сбое записи).
 */
export async function submitCallbackRequest(
  event: H3Event,
  body: RequestBody | null | undefined,
): Promise<CallbackSubmitData> {
  const log = loggerFor(event)

  if (isHoneypotFilled(body)) {
    log.debug('callback honeypot triggered')
    return { ok: true }
  }

  const data = parseRequestBody(body)
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const requestId = event.context.requestId ?? null

  const existing = await callbackRequestRepository.findNewByPhoneDigits(data.phoneDigits)
  if (existing) {
    log.debug('callback duplicate active request', {
      id: existing.id,
      phone: data.phoneDigits,
    })
    return { ok: true, id: existing.id, duplicate: true }
  }

  assertRequestRateLimit(ip)

  const saved = await callbackRequestRepository.create({
    name: data.name,
    phone: data.phone,
    phoneDigits: data.phoneDigits,
    title: data.title,
    ip,
    requestId,
  })

  log.info('callback request accepted', {
    id: saved.id,
    name: saved.name,
    phone: saved.phoneDigits,
    title: saved.title,
    ip: saved.ip,
    createdAt: saved.createdAt,
  })

  await notifyCallbackCreated(saved)

  return { ok: true, id: saved.id }
}
