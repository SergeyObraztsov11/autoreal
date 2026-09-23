<script setup lang="ts">
const { show } = useRequestModal()
const menuOpen = useState('mobile-menu-open', () => false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 480
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <button
    type="button"
    class="g-tile g-tile-yellow fixed bottom-5 right-4 z-40 h-14 w-14 border-2 border-ink shadow-hard-md transition-[transform,opacity] duration-300 lg:hidden"
    :class="
      scrolled && !menuOpen
        ? 'translate-y-0 opacity-100'
        : 'pointer-events-none translate-y-6 opacity-0'
    "
    style="bottom: calc(1.25rem + env(safe-area-inset-bottom))"
    aria-label="Заказать обратный звонок"
    @click="show()"
  >
    <Icon name="lucide:phone" class="size-6" />
  </button>
</template>
