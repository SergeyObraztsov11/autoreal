/**
 * Время во всём приложении в поясе из NUXT_APP_TIMEZONE (по умолчанию Москва).
 */
import { config } from './config'

/**
 * Смещение пояса для даты в формате +03:00.
 * Получает: date и IANA-имя пояса.
 * Делает: спрашивает Intl timeZoneName longOffset.
 * Возвращает: строку смещения.
 */
function zoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
    hour: '2-digit',
  }).formatToParts(date)
  const raw = parts.find(part => part.type === 'timeZoneName')?.value ?? 'GMT+03:00'
  const match = raw.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/)
  if (!match) return '+03:00'
  const sign = match[1]
  const hours = (match[2] ?? '0').padStart(2, '0')
  const minutes = (match[3] ?? '00').padStart(2, '0')
  return `${sign}${hours}:${minutes}`
}

/**
 * Переводит Date в поля календаря по часовому поясу приложения.
 * Получает: date — момент времени (обычно new Date()).
 * Делает: считает час/дату в config.timezone.
 * Возвращает: год, месяц, день, часы, минуты, секунды.
 */
function calendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: config.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value ?? '00'

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  }
}

/**
 * Форматирует момент времени в ISO с поясом приложения.
 * Получает: date — любой Date.
 * Делает: собирает строку вида 2026-09-21T21:41:24+03:00.
 * Возвращает: строку ISO.
 */
export function formatIso(date: Date) {
  const p = calendarParts(date)
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${zoneOffset(date, config.timezone)}`
}

/**
 * Текущее время приложения.
 * Получает: ничего.
 * Делает: берёт now и форматирует.
 * Возвращает: ISO-строку.
 */
export function nowIso() {
  return formatIso(new Date())
}

/**
 * Календарная дата для произвольного момента.
 * Получает: date — по умолчанию сейчас.
 * Делает: считает YYYY-MM-DD в поясе приложения.
 * Возвращает: строку даты.
 */
export function dateStamp(date: Date = new Date()) {
  const p = calendarParts(date)
  return `${p.year}-${p.month}-${p.day}`
}

/**
 * Календарная дата приложения (для имени лог-файла).
 * Получает: ничего.
 * Делает: берёт сегодняшнюю дату по поясу приложения.
 * Возвращает: YYYY-MM-DD.
 */
export function todayDate() {
  return dateStamp()
}

/**
 * Человекочитаемые дата и время в поясе приложения.
 * Получает: Date или ISO-строку (по умолчанию сейчас).
 * Делает: считает день/месяц/год и часы:минуты в config.timezone.
 * Возвращает: строку вида 24.09.2026 17:05.
 */
export function formatDateTime(value: Date | string = new Date()) {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return String(value)
  const p = calendarParts(date)
  return `${p.day}.${p.month}.${p.year} ${p.hour}:${p.minute}`
}
