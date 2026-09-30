/**
 * Site media paths under /public.
 * Home images: /public/stock. Letters: /public/media/letters.
 */

export const media = {
  home: {
    hero: '/stock/podmashinoi.png',
    akpp: '/stock/maslo.png',
    store: '/stock/karzina.png',
    garage: '/stock/garaz.png',
  },
  services: {
    maintenance: '/stock/services/maintenance.png',
    suspension: '/stock/services/suspension.png',
    electrical: '/stock/services/electrical.png',
    alarm: '/stock/services/alarm.png',
    soundproofing: '/stock/services/soundproofing.png',
    diagnostics: '/stock/services/diagnostics.png',
    'tire-service': '/stock/services/tire-service.png',
    'ac-service': '/stock/services/ac-service.png',
  },
  /** Certificates & thank-you letters (from legacy STO site) */
  letters: [
    '/media/letters/thanks-01.jpg',
    '/media/letters/thanks-02.jpg',
    '/media/letters/thanks-03.jpg',
    '/media/letters/thanks-04.jpg',
    '/media/letters/thanks-05.jpg',
    '/media/letters/thanks-06.jpg',
    '/media/letters/thanks-07.jpg',
    '/media/letters/thanks-08.jpg',
    '/media/letters/thanks-09.jpg',
    '/media/letters/thanks-10.jpg',
    '/media/letters/thanks-11.jpg',
    '/media/letters/thanks-12.jpg',
    '/media/letters/thanks-13.jpg',
    '/media/letters/thanks-14.jpg',
    '/media/letters/thanks-15.jpg',
    '/media/letters/thanks-16.jpg',
    '/media/letters/thanks-17.jpg',
    '/media/letters/thanks-18.jpg',
    '/media/letters/thanks-19.jpg',
  ],
} as const
