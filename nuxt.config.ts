// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts', '@nuxt/icon', '@nuxt/eslint'],
  css: ['~/assets/css/tokens.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
      ],
    },
  },
  routeRules: {
    '/services': { redirect: '/service' },
    '/parts': { redirect: '/store' },
    '/contacts': { redirect: '/about' },
  },
  runtimeConfig: {
    logLevel: 'info',
    logRetentionDays: 14,
    rateLimitMax: 5,
    rateLimitWindowMinutes: 15,
    appTimezone: 'Europe/Moscow',
  },
  fonts: {
    families: [
      { name: 'Onest', provider: 'google', weights: [500, 600, 700, 800] },
      { name: 'Golos Text', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },
})
