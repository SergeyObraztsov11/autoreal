/**
 * Логирует необработанные ошибки Nitro/SSR и кладёт requestId в error.data.
 * Тот же id потом показывается на error.vue и ищется в logs/.
 */
import { appLogger } from '../utils/logger'

type ErrorWithPayload = Error & {
  statusCode?: number
  data?: unknown
}

/**
 * Пишет requestId внутрь error.data, не затирая остальные поля.
 * Получает: объект ошибки и requestId текущего HTTP-запроса.
 * Делает: дополняет error.data.
 * Возвращает: ничего.
 */
function attachRequestId(error: ErrorWithPayload, requestId: string | null) {
  if (!requestId) return
  if (error.data && typeof error.data === 'object') {
    ;(error.data as Record<string, unknown>).requestId = requestId
    return
  }
  error.data = { requestId }
}

export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('error', (error, context) => {
    const err = error as ErrorWithPayload
    const statusCode = Number(err.statusCode) || 500
    if (statusCode === 404) return

    const requestId = context.event?.context.requestId ?? null
    attachRequestId(err, requestId)

    appLogger.error('unhandled server error', {
      requestId,
      statusCode,
      err: err.message,
      stack: err.stack,
    })
  })
})
