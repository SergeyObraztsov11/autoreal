/**
 * Хелперы для российских номеров телефона на сервере.
 * Нормализация к 11 цифрам и проверка «номер заполнен полностью».
 */

/**
 * Приводит строку телефона к виду 7XXXXXXXXXX (только цифры).
 * Получает: raw — телефон в любом виде (+7, 8, скобки, пробелы).
 * Делает: выкидывает нецифры; 8…(11) → 7…; локальные 10 цифр без кода → 7….
 * Не дописывает 7 к неполному номеру, который уже начинается с 7/8.
 * Возвращает: строку цифр (может быть невалидной длины, если вход кривой).
 */
export function normalizeRuPhone(raw: string) {
  const d = raw.replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('8')) return `7${d.slice(1)}`
  // 10 digits without country code only — never pad incomplete "+7 …" (10 digits starting with 7)
  if (d.length === 10 && !d.startsWith('7') && !d.startsWith('8')) return `7${d}`
  return d
}

/**
 * Проверяет, что телефон — полный российский номер.
 * Получает: raw — телефон в любом виде.
 * Делает: нормализует и сверяет с шаблоном 7 + 10 цифр.
 * Возвращает: true, если номер валиден; иначе false.
 */
export function isValidRuPhone(raw: string) {
  return /^7\d{10}$/.test(normalizeRuPhone(raw))
}
