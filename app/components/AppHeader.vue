<script setup lang="ts">
import { brand, hours, nav, phones } from '~/data/site'

const route = useRoute()
const menuOpen = useState('mobile-menu-open', () => false)
useScrollLock(menuOpen)

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <header
    class="border-b-2 border-ink bg-white"
    :class="menuOpen ? 'fixed inset-x-0 top-0 z-[60]' : 'sticky top-0 z-50'"
  >
    <div
      class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 md:gap-6 md:px-6 md:py-3"
    >
      <NuxtLink to="/" class="min-w-0 shrink" @click="menuOpen = false">
        <img
          :src="brand.logo"
          :alt="brand.name"
          class="h-6 w-auto max-w-full object-contain object-left md:h-8 lg:h-7 xl:h-8"
          width="180"
          height="44"
        />
      </NuxtLink>

      <nav class="hidden items-center gap-5 lg:flex xl:gap-8">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="whitespace-nowrap text-sm font-semibold text-ink decoration-yellow decoration-[3px] underline-offset-[6px]"
          :class="isActive(item.to) ? 'underline' : 'hover:underline'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hidden shrink-0 items-center gap-4 lg:flex xl:gap-5">
        <PhoneLink :number="phones.service" class="whitespace-nowrap text-sm font-bold text-ink" />
        <CallbackButton class="whitespace-nowrap" />
      </div>

      <div class="lg:hidden">
        <button
          type="button"
          class="inline-flex h-11 items-center gap-2 border-2 border-ink bg-white px-3.5 text-sm font-bold shadow-hard-sm transition-[transform,box-shadow] active:translate-x-px active:translate-y-px active:shadow-none"
          :aria-expanded="menuOpen"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="menuOpen = !menuOpen"
        >
          <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" class="size-5 shrink-0" />
          {{ menuOpen ? 'Закрыть' : 'Меню' }}
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <div
      v-if="menuOpen"
      class="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white pt-16 lg:hidden"
    >
      <nav class="flex flex-col px-4 pt-2">
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
          >{{ item.label }}</span>
          <Icon
            name="lucide:arrow-right"
            class="size-5"
            :class="isActive(item.to) ? '' : 'opacity-30'"
          />
        </NuxtLink>
      </nav>

      <div class="mt-auto bg-canvas px-4 py-6">
        <p class="g-label mb-2">Автотехцентр</p>
        <PhoneLink :number="phones.service" class="text-2xl font-bold" />
        <p class="mt-1 text-sm text-muted">{{ hours.weekdays }} · {{ hours.weekend }}</p>
        <CallbackButton class="mt-5 w-full" @click="menuOpen = false" />
      </div>
    </div>
  </Teleport>
</template>
