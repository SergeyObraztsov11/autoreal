<script setup lang="ts">
import { getService } from '~/data/services'
import type { Service } from '~/data/services'
import { media } from '~/data/media'

const list: { slug: keyof typeof media.services }[] = [
  { slug: 'maintenance' },
  { slug: 'suspension' },
  { slug: 'electrical' },
  { slug: 'alarm' },
  { slug: 'soundproofing' },
  { slug: 'diagnostics' },
  { slug: 'tire-service' },
  { slug: 'ac-service' },
]

const services = list
  .map((i, index) => ({
    ...i,
    index: index + 1,
    s: getService(i.slug),
    image: media.services[i.slug],
  }))
  .filter(
    (i): i is {
      slug: keyof typeof media.services
      index: number
      s: Service
      image: string
    } => Boolean(i.s),
  )
</script>

<template>
  <section id="services" class="relative scroll-mt-20 bg-ink text-white">
    <div class="g-container g-section">
      <div class="mb-6 grid gap-5 md:mb-8 lg:mb-10 lg:grid-cols-[1fr_auto] lg:items-end">
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
        grid-class="lg:grid-cols-4 lg:gap-x-5 lg:gap-y-16"
        slide-class="w-[min(18.5rem,calc(100vw-3rem))] pt-2 md:w-[20rem]"
      >
        <template #default="{ item }">
          <NuxtLink
            :to="`/service#${item.slug}`"
            class="group relative flex h-full w-full flex-col pt-20 text-ink md:pt-24"
          >
            <img
              :src="item.image"
              alt=""
              class="pointer-events-none absolute left-1/2 top-0 z-10 h-40 w-auto max-w-[92%] -translate-x-1/2 object-contain drop-shadow-[4px_8px_0_rgb(10_10_10/22%)] transition-transform duration-300 md:h-44 md:group-hover:-translate-y-1.5"
              loading="lazy"
              decoding="async"
            />

            <div
              class="g-card relative flex h-full min-h-[13.5rem] flex-col px-5 pb-5 pt-[4.25rem] transition-transform active:translate-y-px md:min-h-[14.5rem] md:px-6 md:pb-6 md:pt-[4.75rem] md:group-hover:-translate-y-1"
            >
              <h3 class="g-display text-[1.4rem] font-bold leading-[1.1] text-ink md:text-[1.65rem]">
                {{ item.s.title }}
              </h3>

              <p class="mt-3 text-[0.95rem] leading-relaxed text-ink/90">
                {{ item.s.short }}
              </p>

              <div class="mt-auto flex items-center justify-between gap-3 border-t-2 border-line pt-4">
                <span class="g-kicker text-muted">
                  {{ String(item.index).padStart(2, '0') }}
                </span>
                <span class="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
                  Подробнее
                  <Icon
                    name="lucide:arrow-right"
                    class="size-4 transition-transform duration-200 md:group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </div>
          </NuxtLink>
        </template>
      </SnapSwiper>

      <div class="mt-8 lg:hidden">
        <NavButton to="/service" variant="dark" class="w-full">Все услуги</NavButton>
      </div>
    </div>
  </section>
</template>
