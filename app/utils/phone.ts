/** Normalize any RU phone string to 11 digits starting with 7 */
export function normalizeRuPhone(raw: string) {
  const d = raw.replace(/\D/g, '')
  if (d.length === 10) return `7${d}`
  if (d.length === 11 && d.startsWith('8')) return `7${d.slice(1)}`
  return d
}

/** True when the number is a complete Russian mobile/landline: 7 + 10 digits */
export function isValidRuPhone(raw: string) {
  return /^7\d{10}$/.test(normalizeRuPhone(raw))
}

export function phoneTelHref(raw: string) {
  return `tel:+${normalizeRuPhone(raw)}`
}

export const PHONE_MASK_LENGTH = '+7 (999) 999-99-99'.length

/** Progressive input mask: "+7 (9", "+7 (999) 12", ... "+7 (999) 999-99-99" */
export function maskPhoneInput(raw: string) {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('8') || d.startsWith('7')) d = d.slice(1)
  d = d.slice(0, 10)
  if (!d) return raw.trim() ? '+7 (' : ''

  let out = `+7 (${d.slice(0, 3)}`
  if (d.length > 3) out += `) ${d.slice(3, 6)}`
  if (d.length > 6) out += `-${d.slice(6, 8)}`
  if (d.length > 8) out += `-${d.slice(8, 10)}`
  return out
}

/** +7 (XXX) XXX-XX-XX */
export function formatPhoneDisplay(raw: string) {
  const d = normalizeRuPhone(raw)
  if (d.length !== 11 || !d.startsWith('7')) return raw
  return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}`
}
