/**
 * Настройки приложения из переменных окружения.
 * Значения по умолчанию — для локальной разработки; в проде задаются через .env.
 */

/**
 * Читает строку из env или возвращает запасное значение.
 * Получает: имя переменной и fallback.
 * Делает: trim, пустую строку считает «не задано».
 * Возвращает: строку.
 */
function str(name: string, fallback: string) {
  const value = process.env[name]?.trim()
  return value || fallback
}

/**
 * Читает число из env или возвращает запасное значение.
 * Получает: имя переменной и fallback.
 * Делает: Number(); нечисловое значение игнорирует.
 * Возвращает: число.
 */
function num(name: string, fallback: number) {
  const raw = process.env[name]
  if (raw == null || raw.trim() === '') return fallback
  const value = Number(raw)
  return Number.isFinite(value) ? value : fallback
}

export const config = {
  get logLevel() {
    return str('NUXT_LOG_LEVEL', str('LOG_LEVEL', 'info')).toLowerCase()
  },
  get logRetentionDays() {
    return num('NUXT_LOG_RETENTION_DAYS', 14)
  },
  get rateLimitMax() {
    return num('NUXT_RATE_LIMIT_MAX', 5)
  },
  get rateLimitWindowMinutes() {
    return num('NUXT_RATE_LIMIT_WINDOW_MINUTES', 15)
  },
  get timezone() {
    return str('NUXT_APP_TIMEZONE', 'Europe/Moscow')
  },
  get telegramBotToken() {
    return str('NUXT_TELEGRAM_BOT_TOKEN', '')
  },
  get telegramChatIds() {
    return str('NUXT_TELEGRAM_CHAT_ID', '')
      .split(',')
      .map(id => id.trim())
      .filter(Boolean)
  },
}
