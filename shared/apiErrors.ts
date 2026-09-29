/**
 * Единый каталог типов ошибок API.
 * Здесь описываются code, HTTP-статус, сообщение в JSON и текст для UI.
 * Новую ошибку добавляй только сюда — сервер и клиент берут значения отсюда.
 */

export const ApiErrors = {
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    statusCode: 422,
    message: 'Invalid request data',
    clientMessage: 'Проверьте заполненные поля.',
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    statusCode: 429,
    message: 'Too many requests',
    clientMessage: 'Слишком много попыток. Попробуйте позже.',
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    message: 'Internal server error',
    clientMessage: 'Не удалось отправить. Попробуйте ещё раз.',
  },
} as const

export type ApiErrorCode = keyof typeof ApiErrors

export type ApiErrorDefinition = (typeof ApiErrors)[ApiErrorCode]

/**
 * Возвращает описание ошибки по коду.
 * Получает: code — ключ из ApiErrors.
 * Делает: ищет запись в каталоге.
 * Возвращает: объект с statusCode, message, clientMessage.
 */
export function getApiError(code: ApiErrorCode): ApiErrorDefinition {
  return ApiErrors[code]
}
