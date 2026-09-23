/**
 * Серверный логгер приложения.
 * Пишет в терминал (consola) и параллельно в logs/app-YYYY-MM-DD.log (JSON Lines).
 */
import { appendFile, mkdir, readdir, unlink } from 'node:fs/promises'
import path from 'node:path'
import { createConsola } from 'consola'
import type { H3Event } from 'h3'
import { todayDate, nowIso, dateStamp } from '../../shared/time'
import { config } from '../../shared/config'
import { getRequestId } from './apiResponse'

const LEVELS = {
  silent: -999,
  fatal: 0,
  error: 1,
  warn: 2,
  log: 3,
  info: 3,
  success: 3,
  fail: 3,
  ready: 3,
  start: 3,
  box: 3,
  debug: 4,
  trace: 5,
  verbose: 999,
} as const

type LevelName = keyof typeof LEVELS
type LogLevel = 'info' | 'warn' | 'error' | 'debug'
type Meta = Record<string, unknown>

const logsDir = path.join(process.cwd(), 'logs')
const LOG_FILE_RE = /^app-(\d{4}-\d{2}-\d{2})\.log$/
const PRUNE_EVERY_MS = 60 * 60 * 1000

let lastPruneAt = 0

/**
 * Определяет числовой уровень логирования из переменных окружения.
 * Получает: ничего (читает NUXT_LOG_LEVEL или LOG_LEVEL).
 * Делает: сопоставляет имя уровня с константами consola.
 * Возвращает: числовой level (по умолчанию info).
 */
function resolveLevel(): number {
  return LEVELS[config.logLevel as LevelName] ?? LEVELS.info
}

const activeLevel = resolveLevel()

/**
 * Проверяет, нужно ли писать сообщение данного уровня.
 * Получает: level — info | warn | error | debug.
 * Делает: сравнивает с активным NUXT_LOG_LEVEL.
 * Возвращает: true, если сообщение достаточно важное.
 */
function shouldLog(level: LogLevel) {
  return LEVELS[level] <= activeLevel
}

/** Глобальный логгер с тегом autoreal. В обработчиках лучше брать loggerFor(event). */
export const logger = createConsola({
  level: activeLevel,
  defaults: {
    tag: 'autoreal',
  },
})

/**
 * Возвращает путь к лог-файлу за сегодня.
 * Получает: ничего.
 * Делает: собирает logs/app-YYYY-MM-DD.log.
 * Возвращает: абсолютный путь к файлу.
 */
function todayLogFile() {
  const day = todayDate()
  return path.join(logsDir, `app-${day}.log`)
}

/**
 * Удаляет лог-файлы старше срока хранения (по умолчанию 14 дней).
 * Получает: force — true при старте сервера, чтобы не ждать час.
 * Делает: не чаще раза в час (если не force) читает logs/ и удаляет app-YYYY-MM-DD.log старше cutoff.
 * Возвращает: Promise<void>.
 */
export async function pruneOldLogs(force = false) {
  const now = Date.now()
  if (!force && now - lastPruneAt < PRUNE_EVERY_MS) return
  lastPruneAt = now

  const cutoff = dateStamp(new Date(now - config.logRetentionDays * 24 * 60 * 60 * 1000))

  try {
    const names = await readdir(logsDir)
    for (const name of names) {
      const match = LOG_FILE_RE.exec(name)
      if (!match) continue
      const day = match[1]
      if (!day || day >= cutoff) continue
      await unlink(path.join(logsDir, name))
    }
  }
  catch {
    // Чистка не должна ронять запись лога.
  }
}

/**
 * Дописывает одну JSON-строку в дневной лог-файл.
 * Получает: level, message и meta (включая requestId).
 * Делает: создаёт папку при необходимости и append в файл.
 * Возвращает: Promise<void> (ошибки записи глотает, чтобы не ронять запрос).
 */
async function writeToFile(level: LogLevel, message: string, meta: Meta) {
  try {
    await mkdir(logsDir, { recursive: true })
    const line = JSON.stringify({
      level,
      time: nowIso(),
      message,
      ...meta,
    })
    await appendFile(todayLogFile(), `${line}\n`, 'utf8')
    void pruneOldLogs()
  }
  catch {
    // Логирование не должно ломать обработку заявки.
  }
}

/**
 * Собирает объект логгера, который всегда пишет переданный requestId.
 * Получает: requestId текущего HTTP-запроса (или null).
 * Делает: оборачивает методы info/warn/error/debug (терминал + файл).
 * Возвращает: объект с методами логирования.
 */
function bind(requestId: string | null) {
  /**
   * Пишет одну запись в consola и в файл.
   * Получает: level, текстовое message и произвольные meta-поля.
   * Делает: фильтр по уровню → терминал → JSON line в logs/.
   * Возвращает: ничего.
   */
  const write = (level: LogLevel, message: string, meta: Meta = {}) => {
    if (!shouldLog(level)) return
    const payload = { requestId, ...meta }
    logger[level](message, payload)
    void writeToFile(level, message, payload)
  }

  return {
    info: (message: string, meta?: Meta) => write('info', message, meta),
    warn: (message: string, meta?: Meta) => write('warn', message, meta),
    error: (message: string, meta?: Meta) => write('error', message, meta),
    debug: (message: string, meta?: Meta) => write('debug', message, meta),
  }
}

/**
 * Создаёт логгер, привязанный к текущему HTTP-запросу.
 * Получает: event Nitro/H3.
 * Делает: достаёт requestId из контекста и передаёт в bind.
 * Возвращает: объект с методами info/warn/error/debug.
 */
export function loggerFor(event: H3Event) {
  return bind(getRequestId(event))
}

/** Логгер без HTTP-контекста (уведомления и фоновые задачи) — тоже пишет в файл. */
export const appLogger = bind(null)
