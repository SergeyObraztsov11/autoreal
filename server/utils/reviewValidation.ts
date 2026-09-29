/**
 * Валидация тела отзыва с сайта.
 */
import { AppError } from './appError'
import type { ErrorDetail } from './apiResponse'

const NAME_RE = /^[a-zA-Zа-яА-ЯёЁ\s'-]{2,60}$/
const TEXT_MIN = 20
const TEXT_MAX = 1200

export type ReviewBody = {
  name?: string
  rating?: number | string
  text?: string
  /** Honeypot — у человека должно оставаться пустым */
  website?: string
}

export type ValidReview = {
  author: string
  rating: number
  text: string
}

/**
 * Валидирует тело запроса отзыва.
 * Получает: сырое body формы.
 * Делает: проверяет имя, оценку и текст.
 * Возвращает: нормализованные данные. При ошибке бросает AppError VALIDATION_ERROR.
 */
export function parseReviewBody(body: ReviewBody | null | undefined): ValidReview {
  const author = body?.name?.trim() ?? ''
  const text = body?.text?.trim() ?? ''
  const ratingRaw = body?.rating
  const rating
    = typeof ratingRaw === 'number'
      ? ratingRaw
      : typeof ratingRaw === 'string'
        ? Number(ratingRaw)
        : NaN

  const details: ErrorDetail[] = []

  if (!author || !NAME_RE.test(author)) {
    details.push({ field: 'name', message: 'Укажите корректное имя' })
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    details.push({ field: 'rating', message: 'Выберите оценку от 1 до 5' })
  }

  if (!text || text.length < TEXT_MIN) {
    details.push({
      field: 'text',
      message: `Напишите отзыв — минимум ${TEXT_MIN} символов`,
    })
  }
  else if (text.length > TEXT_MAX) {
    details.push({
      field: 'text',
      message: `Отзыв слишком длинный — максимум ${TEXT_MAX} символов`,
    })
  }

  if (details.length > 0) {
    throw new AppError('VALIDATION_ERROR', details)
  }

  return { author, rating, text }
}

/**
 * Проверяет, сработала ли honeypot-ловушка.
 */
export function isReviewHoneypotFilled(body: ReviewBody | null | undefined) {
  return Boolean(body?.website?.trim())
}
