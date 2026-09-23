/** Locks page scroll while `locked` is true. Multiple lockers are ref-counted. */
export function useScrollLock(locked: Ref<boolean>) {
  const count = useState('scroll-lock-count', () => 0)
  const scrollY = useState('scroll-lock-y', () => 0)

  function scrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth
  }

  function apply() {
    if (!import.meta.client) return
    const body = document.body
    const html = document.documentElement

    if (count.value > 0) {
      if (body.style.position === 'fixed') return
      scrollY.value = window.scrollY
      const pad = scrollbarWidth()
      body.style.position = 'fixed'
      body.style.top = `-${scrollY.value}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
      if (pad > 0) body.style.paddingRight = `${pad}px`
      return
    }

    if (body.style.position !== 'fixed') return

    const y = scrollY.value
    // Avoid jump: site uses scroll-behavior:smooth, so restore instantly in the same turn.
    const prevBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''
    body.style.paddingRight = ''
    window.scrollTo({ top: y, left: 0, behavior: 'auto' })
    html.style.scrollBehavior = prevBehavior
  }

  watch(locked, v => {
    count.value += v ? 1 : -1
    apply()
  })

  onMounted(() => {
    if (locked.value) {
      count.value += 1
      apply()
    }
  })

  onBeforeUnmount(() => {
    if (locked.value) {
      count.value -= 1
      apply()
    }
  })
}
