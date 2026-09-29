/** Locks page scroll while `locked` is true. Multiple lockers are ref-counted. */
export function useScrollLock(locked: Ref<boolean>) {
  const count = useState('scroll-lock-count', () => 0)

  function apply() {
    if (!import.meta.client) return
    const html = document.documentElement
    const body = document.body

    if (count.value > 0) {
      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
      html.style.overscrollBehavior = 'none'
      return
    }

    html.style.overflow = ''
    body.style.overflow = ''
    html.style.overscrollBehavior = ''
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
