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
  <section id="services" class="relative scroll-mt-20 overflow-hidden bg-ink text-white">
    <div class="g-container g-section">
      <div class="mb-5 grid gap-5 md:mb-6 lg:mb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div class="max-w-2xl">
          <p class="g-label text-yellow">Автотехцентр</p>
          <h2 class="g-h g-h2 on-dark">
            Работы —
            <br class="hidden md:block" />
            от планового ТО до <b>электрики</b>
          </h2>
        </div>
        <div class="hidden lg:block">
          <NavButton to="/service" variant="dark">Все услуги</NavButton>
        </div>
      </div>

      <SnapSwiper
        :items="services"
        label="Услуги автотехцентра"
        tone="dark"
        :item-key="item => item.slug"
      >
        <template #default="{ item }">
          <NuxtLink
            :to="`/service#${item.slug}`"
            class="group g-radius flex h-full w-full flex-col border-2 border-ink bg-white p-5 text-ink shadow-hard-yellow transition-transform active:translate-y-px md:hover:-translate-y-1"
          >
            <div class="flex items-center gap-3.5">
              <span class="g-tile g-tile-yellow h-11 w-11 shrink-0">
                <Icon :name="item.icon" class="size-5" />
              </span>
              <h3 class="g-display text-lg font-bold leading-snug">
                {{ item.s.title }}
              </h3>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-muted">
              {{ item.s.short }}
            </p>
          </NuxtLink>
        </template>
      </SnapSwiper>

      <div class="mt-8 lg:hidden">
        <NavButton to="/service" variant="dark" class="w-full">Все услуги</NavButton>
      </div>
    </div>
  </section>
</template>
