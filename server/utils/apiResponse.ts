/**
 * Единый формат успешных и ошибочных ответов API.
 * Такой же смысл, как в методичке: { data } и { error: { code, message, details, requestId } }.
 */
import type { H3Event } from 'h3'
import { getApiError, type ApiErrorCode } from '../../shared/apiErrors'

export type ErrorDetail = {
  field: string
  message: string
}

export type ApiErrorBody = {
  error: {
    code: string
    message: string
    details: ErrorDetail[]
    requestId: string | null
  }
}

export type ApiSuccessBody<T> = {
  data: T
}

/**
 * Достаёт идентификатор текущего HTTP-запроса из контекста.
 * Получает: event Nitro/H3.
 * Делает: читает event.context.requestId.
 * Возвращает: строку requestId или null.
 */
export function getRequestId(event: H3Event) {
  return event.context.requestId ?? null
}

/**
 * Формирует успешный ответ API.
 * Получает: произвольные данные data (то, что отдаём клиенту).
 * Делает: оборачивает их в объект { data }.
 * Возвращает: ApiSuccessBody<T>.
 */
export function ok<T>(data: T): ApiSuccessBody<T> {
  return { data }
}

/**
 * Формирует ошибочный ответ API по типу из shared/apiErrors.
 * Получает: event, code из каталога ошибок и опционально details по полям.
 * Делает: подставляет status/message из каталога и собирает { error }.
 * Возвращает: ApiErrorBody — отдавать из HTTP-хендлера через return fail(...).
 */
export function fail(
  event: H3Event,
  code: ApiErrorCode,
  details: ErrorDetail[] = [],
): ApiErrorBody {
  const definition = getApiError(code)
  setResponseStatus(event, definition.statusCode)
  return {
    error: {
      code: definition.code,
      message: definition.message,
      details,
      requestId: getRequestId(event),
    },
  }
}
