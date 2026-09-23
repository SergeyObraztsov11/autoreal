/**
 * Middleware: присваивает каждому HTTP-запросу уникальный requestId.
 * Нужен, чтобы связать логи, ошибки API и запись заявки в JSON.
 */
import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'

declare module 'h3' {
  interface H3EventContext {
    requestId?: string
  }
}

/**
 * Вешает requestId на входящий запрос и отдаёт его клиенту в заголовке.
 * Получает: event Nitro/H3.
 * Делает: берёт X-Request-Id из заголовка или генерирует UUID; пишет в context и ответ.
 * Возвращает: ничего (middleware только обогащает event).
 */
export default defineEventHandler((event: H3Event) => {
  const incoming = getHeader(event, 'x-request-id')
  const id = incoming?.trim() || randomUUID()
  event.context.requestId = id
  setHeader(event, 'X-Request-Id', id)
})
