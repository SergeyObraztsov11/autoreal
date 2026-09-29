<script setup lang="ts">
import type { Service } from '~/data/services'

const props = defineProps<{
  items: Service[]
  /** Contact phone for CTA column */
  phone: string
  ctaLabel?: string
}>()

const route = useRoute()

const openSlug = ref<string | null>(null)

function isOpen(slug: string) {
  return openSlug.value === slug
}

function toggle(slug: string) {
  if (openSlug.value === slug) {
    openSlug.value = null
    if (import.meta.client) {
      history.replaceState(null, '', route.path)
    }
    return
  }

  openSlug.value = slug
  if (import.meta.client) {
    history.replaceState(null, '', `${route.path}#${slug}`)
  }
}

function syncFromHash() {
  const hash = route.hash.replace(/^#/, '')
  if (hash && props.items.some(i => i.slug === hash)) {
    openSlug.value = hash
  }
}

onMounted(() => {
  syncFromHash()
  if (openSlug.value && import.meta.client) {
    document.getElementById(openSlug.value)?.scrollIntoView({ block: 'start' })
  }
})

watch(() => route.hash, syncFromHash)
</script>

<template>
  <ul class="space-y-4">
    <li
      v-for="(item, i) in items"
      :id="item.slug"
      :key="item.slug"
      class="scroll-mt-24 g-radius border-2 border-ink bg-white transition-shadow"
      :class="isOpen(item.slug) ? 'g-hard' : 'shadow-hard-yellow'"
    >
      <button
        type="button"
        class="group flex w-full items-start gap-3.5 p-5 text-left sm:gap-4 md:items-center md:gap-6 md:p-6"
        :aria-expanded="isOpen(item.slug)"
        @click="toggle(item.slug)"
      >
        <span class="g-tile h-9 w-9 text-xs font-bold md:h-10 md:w-10 md:text-sm">
          {{ String(i + 1).padStart(2, '0') }}
        </span>

        <div
          class="min-w-0 flex-1 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-8"
        >
          <span class="g-display text-lg font-bold md:text-xl">
            {{ item.title }}
          </span>
          <span class="mt-1 block text-sm text-muted md:mt-0">
            {{ item.short }}
          </span>
        </div>

        <span class="g-tile g-tile-yellow h-9 w-9 shrink-0" aria-hidden="true">
          <Icon
            name="lucide:plus"
            class="size-4 transition-transform"
            :class="isOpen(item.slug) ? 'rotate-45' : ''"
          />
        </span>
      </button>

      <div
        v-show="isOpen(item.slug)"
        class="border-t-2 border-ink p-4 sm:p-5 md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-12 md:p-6"
      >
        <div>
          <p class="max-w-2xl text-[15px] leading-relaxed md:text-base">
            {{ item.body }}
          </p>
          <p class="g-label mt-8 !mb-2">Что входит</p>
          <ul class="max-w-xl">
            <CheckItem v-for="point in item.points" :key="point">
              {{ point }}
            </CheckItem>
          </ul>
        </div>

        <div class="mt-8 g-radius border-2 border-ink bg-yellow p-5 md:mt-0 md:self-start">
          <p class="g-kicker">
            {{ ctaLabel || 'Заявка' }}
          </p>
          <p class="mt-2 text-sm">Оставьте номер или позвоните. Перезвоним в течение 15 минут.</p>
          <CallbackButton class="mt-5 w-full" variant="dark" />
          <PhoneLink :number="phone" class="mt-4 block text-center text-sm font-bold" />
        </div>
      </div>
    </li>
  </ul>
</template>
