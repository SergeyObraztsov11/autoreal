/**
 * Предсказуемая ошибка API: бросается из сервиса и ловится в HTTP-хендлере.
 * Не путать с createError Nitro — те уходят в error-плагин как «необработанные».
 */
import type { ApiErrorCode } from '../../shared/apiErrors'
import type { ErrorDetail } from './apiResponse'

export class AppError extends Error {
  readonly code: ApiErrorCode
  readonly details: ErrorDetail[]

  constructor(code: ApiErrorCode, details: ErrorDetail[] = []) {
    super(code)
    this.name = 'AppError'
    this.code = code
    this.details = details
  }
}

/**
 * Проверяет, что ошибка — известный тип из каталога API.
 * Получает: неизвестный throw.
 * Делает: instanceof AppError.
 * Возвращает: true, если хендлер должен отдать fail(code, details).
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
