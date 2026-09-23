<script setup lang="ts">
import { media } from '~/data/media'
</script>

<template>
  <section class="relative overflow-hidden">
    <span class="absolute right-0 top-10 hidden h-14 w-28 bg-ink lg:block" aria-hidden="true" />
    <span class="absolute right-0 top-10 hidden h-14 w-24 bg-yellow lg:block" aria-hidden="true" />
    <span
      class="g-tri-bl absolute bottom-0 left-0 hidden h-28 w-28 bg-yellow lg:block"
      aria-hidden="true"
    />

    <div
      class="relative mx-auto grid max-w-7xl px-4 pb-10 pt-4 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-6 md:px-6 md:pb-16 md:pt-10 lg:gap-8 lg:pb-28 lg:pt-20"
    >
      <div class="order-1 md:order-2">
        <div class="relative pr-1.5 pb-1.5 md:hidden">
          <img
            :src="media.home.hero"
            alt=""
            class="aspect-[4/3] w-full border-2 border-ink bg-canvas object-cover shadow-hard"
            fetchpriority="high"
          />
        </div>

        <div class="relative hidden aspect-[1.05/1] w-full md:block">
          <div
            class="g-para-wide absolute inset-y-0 left-[12%] right-[-8%] translate-x-3 translate-y-3 bg-ink"
            aria-hidden="true"
          />
          <div
            class="g-para-wide absolute inset-y-0 left-[10%] right-[-6%] bg-yellow"
            aria-hidden="true"
          />
          <img
            :src="media.home.hero"
            alt=""
            class="g-para absolute inset-y-[7%] left-0 h-[86%] w-[96%] bg-canvas object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div class="relative order-2 mt-6 max-w-xl md:order-1 md:mt-0">
        <h1 class="g-h text-3xl leading-[1.12] md:text-5xl md:leading-[1.05] lg:text-6xl">
          Автотехцентр <b>Автореал</b> —
          <br class="hidden md:block" />
          ТО, ремонт и диагностика
          <br class="hidden md:block" />
          в Волгодонске.
        </h1>

        <p class="mt-4 text-[15px] leading-relaxed text-muted md:mt-8 md:max-w-md md:text-base">
          Запишитесь на удобный день — примем без живой очереди. Октябрьское шоссе, 12.
        </p>

        <div class="mt-6 grid gap-3 md:hidden">
          <CallbackButton class="w-full" />
          <NavButton to="/service" variant="ghost" class="w-full">Все услуги</NavButton>
        </div>

        <div class="mt-9 hidden flex-wrap gap-4 md:flex">
          <CallbackButton />
          <NavButton to="/service" variant="ghost">Все услуги</NavButton>
        </div>
      </div>
    </div>
  </section>
</template>
