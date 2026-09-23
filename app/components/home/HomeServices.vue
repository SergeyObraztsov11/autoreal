<script setup lang="ts">
import { getService } from '~/data/services'
import type { Service } from '~/data/services'

const list: { slug: string; icon: string }[] = [
  { slug: 'maintenance', icon: 'lucide:wrench' },
  { slug: 'suspension', icon: 'lucide:car' },
  { slug: 'electrical', icon: 'lucide:zap' },
  { slug: 'alarm', icon: 'lucide:shield' },
  { slug: 'soundproofing', icon: 'lucide:volume-x' },
  { slug: 'diagnostics', icon: 'lucide:gauge' },
  { slug: 'tire-service', icon: 'lucide:circle-dot' },
  { slug: 'ac-service', icon: 'lucide:snowflake' },
]

const services = list
  .map(i => ({ ...i, s: getService(i.slug) }))
  .filter((i): i is { slug: string; icon: string; s: Service } => Boolean(i.s))
</script>

<template>
  <section
    id="services"
    class="g-cut-top-r relative scroll-mt-20 overflow-hidden bg-ink text-white"
  >
    <div
      class="g-chevron pointer-events-none absolute -left-40 top-0 h-full w-[46rem] bg-ink-2"
      aria-hidden="true"
    />
    <span
      class="g-tri-tr absolute right-0 top-0 hidden h-24 w-24 bg-yellow lg:block"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-7xl px-4 pb-10 pt-16 md:px-6 md:py-28">
      <div class="mb-6 grid gap-6 md:mb-12 md:gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div class="max-w-2xl">
          <h2 class="g-h on-dark text-3xl leading-[1.12] md:text-5xl md:leading-[1.08] lg:text-6xl">
            Работы автотехцентра —
            <br class="hidden md:block" />
            от планового ТО до <b>электрики</b>.
          </h2>
        </div>
        <div class="hidden lg:block">
          <NavButton to="/service" variant="dark">Все услуги</NavButton>
        </div>
      </div>

      <ul class="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">
        <li v-for="item in services" :key="item.slug">
          <NuxtLink
            :to="`/service#${item.slug}`"
            class="group flex h-full flex-col border-2 border-ink bg-white p-3.5 text-ink shadow-hard-yellow-md transition-transform hover:-translate-y-1 sm:p-6 sm:shadow-hard-yellow"
          >
            <div class="flex items-center gap-3">
              <span class="g-tile g-tile-yellow h-9 w-9 shrink-0 sm:h-11 sm:w-11">
                <Icon :name="item.icon" class="size-4 sm:size-5" />
              </span>
              <h3 class="g-display text-sm font-bold leading-snug sm:text-lg">
                {{ item.s.title }}
              </h3>
            </div>
            <p class="mt-3 hidden text-sm text-muted sm:block">
              {{ item.s.short }}
            </p>
          </NuxtLink>
        </li>
      </ul>

      <div class="mt-6 lg:hidden">
        <NavButton to="/service" variant="dark" class="w-full">Все услуги</NavButton>
      </div>
    </div>
  </section>
</template>
