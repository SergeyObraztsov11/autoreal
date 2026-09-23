/**
 * Валидация тела заявки на обратный звонок.
 * Проверяет имя/телефон и распознаёт honeypot-поле для ботов.
 */
import { AppError } from './appError'
import { isValidRuPhone, normalizeRuPhone } from './phone'
import type { ErrorDetail } from './apiResponse'

const NAME_RE = /^[a-zA-Zа-яА-ЯёЁ\s'-]{2,60}$/

export type RequestBody = {
  name?: string
  phone?: string
  title?: string
  /** Honeypot — у человека должно оставаться пустым */
  website?: string
}

export type ValidRequest = {
  name: string
  phone: string
  phoneDigits: string
  title: string | null
}

/**
 * Валидирует тело запроса заявки.
 * Получает: сырое body формы.
 * Делает: проверяет имя и телефон, собирает details по полям.
 * Возвращает: нормализованные данные. При ошибке бросает AppError VALIDATION_ERROR.
 */
export function parseRequestBody(body: RequestBody | null | undefined): ValidRequest {
  const name = body?.name?.trim() ?? ''
  const phone = body?.phone?.trim() ?? ''
  const title = body?.title?.trim() || null
  const details: ErrorDetail[] = []

  if (!name || !NAME_RE.test(name)) {
    details.push({ field: 'name', message: 'Укажите корректное имя' })
  }

  if (!isValidRuPhone(phone)) {
    details.push({
      field: 'phone',
      message: 'Укажите телефон в формате +7 (XXX) XXX-XX-XX',
    })
  }

  if (details.length > 0) {
    throw new AppError('VALIDATION_ERROR', details)
  }

  return {
    name,
    phone,
    phoneDigits: normalizeRuPhone(phone),
    title,
  }
}

/**
 * Проверяет, сработала ли honeypot-ловушка.
 * Получает: сырое body формы.
 * Делает: смотрит, заполнено ли скрытое поле website.
 * Возвращает: true, если бот (скорее всего) заполнил поле; иначе false.
 */
export function isHoneypotFilled(body: RequestBody | null | undefined) {
  return Boolean(body?.website?.trim())
}
