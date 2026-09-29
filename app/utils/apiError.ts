/**
 * Разбор ошибок API на клиенте.
 * Коды и тексты баннеров берутся из shared/apiErrors — единого каталога.
 */
import { ApiErrors, type ApiErrorCode } from '#shared/apiErrors'

export type ApiErrorDetail = {
  field: string
  message: string
}

export type ApiErrorPayload = {
  code: string
  message: string
  details: ApiErrorDetail[]
  requestId: string | null
}

export type ParsedApiError = {
  code: string
  message: string
  fieldErrors: Partial<Record<'name' | 'phone' | 'text' | 'rating', string>>
  requestId: string | null
}

/**
 * Достаёт envelope { error } из ошибки $fetch.
 * Получает: неизвестный err от ofetch.
 * Делает: читает err.data.error.
 * Возвращает: payload или null.
 */
function readErrorPayload(err: unknown): ApiErrorPayload | null {
  const data = (err as { data?: unknown })?.data
  if (!data || typeof data !== 'object') return null

  const envelope = data as { error?: ApiErrorPayload }
  if (envelope.error && typeof envelope.error.code === 'string') {
    return {
      code: envelope.error.code,
      message: envelope.error.message || '',
      details: Array.isArray(envelope.error.details) ? envelope.error.details : [],
      requestId: envelope.error.requestId ?? null,
    }
  }

  return null
}

/**
 * Превращает ошибку $fetch в удобный объект для модалки.
 * Получает: err от $fetch.
 * Делает: парсит code/details и раскладывает ошибки по полям.
 * Возвращает: ParsedApiError.
 */
export function parseApiError(err: unknown): ParsedApiError {
  const payload = readErrorPayload(err)
  const fieldErrors: ParsedApiError['fieldErrors'] = {}
  const fallback = ApiErrors.INTERNAL_ERROR

  if (payload) {
    for (const detail of payload.details) {
      if (
        detail.field === 'name'
        || detail.field === 'phone'
        || detail.field === 'text'
        || detail.field === 'rating'
      ) {
        fieldErrors[detail.field] = detail.message
      }
    }

    return {
      code: payload.code,
      message: payload.message || fallback.clientMessage,
      fieldErrors,
      requestId: payload.requestId,
    }
  }

  return {
    code: fallback.code,
    message: fallback.clientMessage,
    fieldErrors: {},
    requestId: null,
  }
}

/**
 * Текст общего баннера под формой (не под конкретным полем).
 * Получает: результат parseApiError.
 * Делает: выбирает clientMessage из каталога ошибок.
 * Возвращает: строку для UI или '' если достаточно fieldErrors.
 */
export function bannerMessageForApiError(parsed: ParsedApiError) {
  if (Object.keys(parsed.fieldErrors).length > 0) {
    return ''
  }

  const known = ApiErrors[parsed.code as ApiErrorCode]
  if (known) return known.clientMessage

  return parsed.message || ApiErrors.INTERNAL_ERROR.clientMessage
}
