<script setup lang="ts">
import { brand, hours, nav, phones } from '~/data/site'

const route = useRoute()
const menuOpen = useState('mobile-menu-open', () => false)
useScrollLock(menuOpen)

const headerEl = ref<HTMLElement>()
const headerHeight = ref(0)

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

function toggleMenu() {
  if (!menuOpen.value && headerEl.value) {
    headerHeight.value = headerEl.value.offsetHeight
  }
  menuOpen.value = !menuOpen.value
}

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <!--
    Sticky breaks when scroll-lock sets overflow:hidden on html/body —
    header jumps to document top and vanishes if the page was scrolled.
    While the menu is open, pin the header with fixed and keep a spacer
    of the same height so the page does not shift.
  -->
  <div v-if="menuOpen" aria-hidden="true" :style="{ height: `${headerHeight}px` }" />
  <header
    ref="headerEl"
    class="border-b-2 border-ink bg-white"
    :class="menuOpen ? 'fixed inset-x-0 top-0 z-[60]' : 'sticky top-0 z-50'"
  >
    <div class="g-container flex items-center justify-between gap-4 py-3 md:gap-6">
      <NuxtLink to="/" class="min-w-0 shrink" @click="menuOpen = false">
        <img
          :src="brand.logo"
          :alt="brand.name"
          class="h-7 w-auto max-w-full object-contain object-left md:h-8"
          width="180"
          height="44"
        />
      </NuxtLink>

      <nav class="hidden items-center gap-6 lg:flex xl:gap-8">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="whitespace-nowrap text-[0.9375rem] font-semibold text-ink decoration-yellow decoration-[3px] underline-offset-[6px]"
          :class="isActive(item.to) ? 'underline' : 'hover:underline'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hidden shrink-0 lg:block">
        <CallbackButton class="whitespace-nowrap" />
      </div>

      <div class="lg:hidden">
        <button
          type="button"
          class="inline-flex h-11 items-center gap-2 border-2 border-ink bg-white px-3.5 text-sm font-bold shadow-hard g-radius transition-[transform,box-shadow] active:translate-x-px active:translate-y-px active:shadow-none"
          :aria-expanded="menuOpen"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="toggleMenu"
        >
          <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" class="size-5 shrink-0" />
          {{ menuOpen ? 'Закрыть' : 'Меню' }}
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="menuOpen" class="fixed inset-0 z-50 lg:hidden">
        <button
          type="button"
          class="drawer-backdrop absolute inset-0 bg-ink/45"
          aria-label="Закрыть меню"
          @click="menuOpen = false"
        />
        <div
          class="drawer-panel absolute inset-y-0 right-0 flex w-[calc(100%-3.5rem)] max-w-sm flex-col overflow-y-auto overscroll-contain border-l-2 border-ink bg-white pt-16 rounded-l-[var(--g-radius)]"
        >
          <nav class="flex flex-col px-5 pt-2">
            <NuxtLink
              v-for="item in nav"
              :key="item.to"
              :to="item.to"
              class="g-display flex items-center justify-between border-b border-line py-4 text-xl font-bold"
              @click="menuOpen = false"
            >
              <span
                class="decoration-yellow decoration-[3px] underline-offset-[6px]"
                :class="isActive(item.to) ? 'underline' : ''"
                >{{ item.label }}</span
              >
              <Icon
                name="lucide:arrow-right"
                class="size-5"
                :class="isActive(item.to) ? '' : 'opacity-30'"
              />
            </NuxtLink>
          </nav>

          <div class="mt-auto bg-canvas px-5 py-6">
            <p class="g-label mb-2">Автотехцентр</p>
            <PhoneLink :number="phones.service" class="text-2xl font-bold" />
            <p class="mt-1 text-sm text-muted">{{ hours.weekdays }} · {{ hours.weekend }}</p>
            <CallbackButton class="mt-5 w-full" @click="menuOpen = false" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active .drawer-backdrop,
.drawer-leave-active .drawer-backdrop {
  transition: opacity 0.2s ease;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.25s ease;
}

.drawer-enter-from .drawer-backdrop,
.drawer-leave-to .drawer-backdrop {
  opacity: 0;
}

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>
