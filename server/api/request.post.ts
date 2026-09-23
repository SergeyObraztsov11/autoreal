/**
 * HTTP-обработчик заявки на обратный звонок (POST /api/request).
 * Единственное место, где результат сервиса становится { data } или { error }.
 */
import { submitCallbackRequest } from '../services/callbackService'
import { isAppError } from '../utils/appError'
import { fail, ok } from '../utils/apiResponse'
import { loggerFor } from '../utils/logger'

/**
 * Обрабатывает POST /api/request.
 * Получает: event Nitro с JSON-телом формы.
 * Делает: вызывает сервис; успех оборачивает в ok, ошибки — в fail.
 * Возвращает: { data } при успехе или { error } при сбое.
 */
export default defineEventHandler(async event => {
  const log = loggerFor(event)

  try {
    const body = await readBody(event)
    const data = await submitCallbackRequest(event, body)
    return ok(data)
  }
  catch (error) {
    if (isAppError(error)) {
      if (error.code === 'VALIDATION_ERROR') {
        log.debug('callback validation failed', {
          code: error.code,
          details: error.details,
        })
      }

      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        log.warn('callback rate limit exceeded', {
          ip: getRequestIP(event, { xForwardedFor: true }) || 'unknown',
        })
      }

      return fail(event, error.code, error.details)
    }

    log.error('callback request failed', {
      err: error instanceof Error ? error.message : String(error),
    })
    return fail(event, 'INTERNAL_ERROR')
  }
})
