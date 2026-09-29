/**
 * На клиенте и при SSR дополняет ошибку Nuxt полем requestId,
 * чтобы error.vue мог показать код обращения.
 */
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('app:error', error => {
    const event = import.meta.server ? tryUseRequestEvent() : null
    const requestId = event?.context.requestId
    if (!requestId) return

    const data = error.data
    if (data && typeof data === 'object') {
      ;(data as Record<string, unknown>).requestId = requestId
      return
    }
    error.data = { requestId }
  })
})

/**
 * Безопасно читает event текущего запроса (на error-странице composable может быть недоступен).
 * Получает: ничего.
 * Делает: вызывает useRequestEvent внутри try/catch.
 * Возвращает: H3 event или null.
 */
function tryUseRequestEvent() {
  try {
    return useRequestEvent()
  } catch {
    return null
  }
}
