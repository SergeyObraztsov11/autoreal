/**
 * Ограничение частоты заявок с одного IP (rate limit).
 * Держит счётчики в памяти процесса: после рестарта сервера они сбрасываются.
 */
import { config } from '../../shared/config'
import { AppError } from './appError'

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/**
 * Проверяет и увеличивает счётчик заявок для IP.
 * Получает: ip клиента.
 * Делает: считает валидные попытки в окне из NUXT_RATE_LIMIT_WINDOW_MINUTES.
 * Возвращает: ничего. При превышении бросает AppError RATE_LIMIT_EXCEEDED.
 */
export function assertRequestRateLimit(ip: string) {
  const now = Date.now()
  const windowMs = config.rateLimitWindowMinutes * 60 * 1000
  let bucket = buckets.get(ip)

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs }
    buckets.set(ip, bucket)
  }

  if (bucket.count >= config.rateLimitMax) {
    throw new AppError('RATE_LIMIT_EXCEEDED')
  }

  bucket.count += 1
}
