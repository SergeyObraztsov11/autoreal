/**
 * HTTP-обработчик отзыва с сайта (POST /api/review).
 */
import { submitSiteReview } from '../services/reviewService'
import { isAppError } from '../utils/appError'
import { fail, ok } from '../utils/apiResponse'
import { loggerFor } from '../utils/logger'

export default defineEventHandler(async event => {
  const log = loggerFor(event)

  try {
    const body = await readBody(event)
    const data = await submitSiteReview(event, body)
    return ok(data)
  } catch (error) {
    if (isAppError(error)) {
      if (error.code === 'VALIDATION_ERROR') {
        log.debug('review validation failed', {
          code: error.code,
          details: error.details,
        })
      }

      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        log.warn('review rate limit exceeded', {
          ip: getRequestIP(event, { xForwardedFor: true }) || 'unknown',
        })
      }

      return fail(event, error.code, error.details)
    }

    log.error('review submit failed', {
      err: error instanceof Error ? error.message : String(error),
    })
    return fail(event, 'INTERNAL_ERROR')
  }
})
