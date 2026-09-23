/** Company contacts, hours, legal — source of truth for layout copy */

export const brand = {
  name: 'Автореал',
  tagline: 'Автотехцентр в Волгодонске',
  legalName: 'ООО «АВТОРЕАЛ ПЛЮС»',
  email: 'autoreal61@bk.ru',
  logo: '/autoreal_logo.png',
  logoSmall: '/autoreal_logo_small.png',
} as const

export const phones = {
  service: '+7 (988) 890-08-39',
  storeTollFree: '+7 (800) 551-18-05',
} as const

/** Same schedule for both locations */
export const hours = {
  weekdays: 'Пн–Пт 9:00–19:00',
  weekend: 'Сб–Вс 9:00–16:00',
} as const

export type Location = {
  id: 'service' | 'store'
  /** Short division name for cards and footer */
  label: string
  icon: string
  title: string
  address: string
  hint: string
  phone: string
  hours: typeof hours
  /** WGS84 from Yandex Maps org cards */
  lat: number
  lon: number
  yandexUrl: string
  yandexOrgId: string
}

export const locations: Location[] = [
  {
    id: 'service',
    label: 'Автотехцентр',
    icon: 'lucide:wrench',
    title: 'Автотехцентр «Автореал»',
    address: 'Октябрьское шоссе, 12',
    hint: 'Территория ГСК «Атом 3». При въезде — налево до конца проезда, отдельно стоящее здание автосервиса',
    phone: phones.service,
    hours,
    lat: 47.511798,
    lon: 42.20875,
    yandexOrgId: '1596960055',
    yandexUrl:
      'https://yandex.ru/maps/org/avtoreal_avtotekhtsentr/1596960055/?ll=42.208750%2C47.511798&z=17',
  },
  {
    id: 'store',
    label: 'Магазин',
    icon: 'lucide:shopping-bag',
    title: 'Магазин автозапчастей и электроники «Автореал»',
    address: 'ул. Маршала Кошевого, 25, стр. 4',
    hint: 'Ориентир — ТД «Ростов»: по направлению от ТЦ «Комфорт» к микрорайону В-16, за отделением Сбербанка',
    phone: phones.storeTollFree,
    hours,
    lat: 47.52699,
    lon: 42.220012,
    yandexOrgId: '49530225896',
    yandexUrl:
      'https://yandex.ru/maps/org/avtoreal_magazin/49530225896/?ll=42.220012%2C47.526990&z=14',
  },
]

export function getLocation(id: Location['id']) {
  const location = locations.find(item => item.id === id)
  if (!location) throw new Error(`Unknown location: ${id}`)
  return location
}

export function yandexRouteUrl(loc: Location) {
  return `https://yandex.ru/maps/?rtext=~${loc.lat}%2C${loc.lon}&rtt=auto`
}

/** Org widget: business card (ol=biz + oid) with a visible pin (pt) */
export function yandexOrgWidgetUrl(loc: Location) {
  const params = new URLSearchParams({
    ol: 'biz',
    oid: loc.yandexOrgId,
    ll: `${loc.lon},${loc.lat}`,
    z: '17',
    pt: `${loc.lon},${loc.lat},pm2rdm`,
    lang: 'ru_RU',
    scroll: 'false',
  })
  return `https://yandex.ru/map-widget/v1/?${params}`
}

export const legal = {
  ogrn: '1136174004086',
  inn: '6143082475',
  kpp: '614301001',
  okpo: '24174348',
  legalAddress: 'г. Волгодонск, ул. Маршала Кошевого 25, строение 4',
} as const

export const nav = [
  { label: 'Главная', to: '/' },
  { label: 'Автотехцентр', to: '/service' },
  { label: 'Магазин', to: '/store' },
  { label: 'О нас', to: '/about' },
] as const

/** `id` — numeric community id (from the widget code at vk.com/dev/Community) */
export const vkGroup = {
  id: 70389671,
  href: 'https://vk.ru/club.autoreal',
} as const

export const social = [
  { label: 'VK', href: vkGroup.href },
  { label: 'Instagram', href: 'https://www.instagram.com/avtoreal_volgodonsk/' },
] as const
