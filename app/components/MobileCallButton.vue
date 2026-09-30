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
  <!-- Hard yellow CTA language (border + extrusion) -->
  <div class="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
    <button
      type="button"
      class="fab-call pointer-events-auto absolute right-4 flex h-14 w-14 items-center justify-center rounded-[var(--g-radius)] border-2 border-ink bg-yellow text-ink"
      :class="
        scrolled && !menuOpen
          ? 'is-visible opacity-100'
          : 'pointer-events-none translate-y-6 opacity-0'
      "
      style="bottom: calc(1.25rem + env(safe-area-inset-bottom))"
      aria-label="Заказать обратный звонок"
      @click="show()"
    >
      <Icon name="mdi:phone" class="size-7" />
    </button>
  </div>
</template>

<style scoped>
.fab-call {
  box-shadow: var(--g-shadow);
  transition:
    opacity 0.3s,
    box-shadow 0.15s;
}

.fab-call.is-visible {
  animation: fab-nudge 4.5s ease-in-out infinite;
}

.fab-call.is-visible:active {
  animation: none;
  transform: translate(2px, 2px);
  box-shadow: var(--g-shadow-press);
}

/* Short shake near the end of each cycle — rest of the time still */
@keyframes fab-nudge {
  0%,
  82%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  85% {
    transform: translate(-3px, 0) rotate(-8deg);
  }
  88% {
    transform: translate(3px, 0) rotate(8deg);
  }
  91% {
    transform: translate(-2px, 0) rotate(-5deg);
  }
  94% {
    transform: translate(2px, 0) rotate(5deg);
  }
  97% {
    transform: translate(0, 0) rotate(0deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fab-call.is-visible {
    animation: none;
  }
}
</style>
