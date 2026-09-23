<script setup lang="ts">
import { media } from '~/data/media'
import { servicesByDivision } from '~/data/services'

const items = servicesByDivision('store').slice(0, 6)
</script>

<template>
  <section id="store" class="relative scroll-mt-20 overflow-hidden bg-white">
    <div
      class="g-para pointer-events-none absolute -left-32 inset-y-0 hidden w-[38rem] bg-canvas lg:block"
      aria-hidden="true"
    />

    <div
      class="relative mx-auto max-w-7xl px-4 py-10 md:grid md:grid-cols-2 md:items-center md:gap-x-8 md:px-6 md:py-20 lg:gap-x-10 lg:py-28"
    >
      <div class="max-w-xl md:col-start-2">
        <h2 class="g-h text-3xl leading-[1.12] md:text-5xl md:leading-[1.08] lg:text-6xl">
          Магазин автозапчастей —
          <br class="hidden md:block" />
          со склада и <b>под заказ</b>.
        </h2>
      </div>

      <div class="mt-5 md:col-start-1 md:row-span-2 md:row-start-1 md:mt-0 md:self-center">
        <SectionPhoto :src="media.home.store" desktop="chevron" desktop-aspect="aspect-[5/4]" />
      </div>

      <div class="mt-5 max-w-xl md:col-start-2 md:mt-6">
        <p class="text-[15px] leading-relaxed text-muted md:max-w-md md:text-base">
          Подбор по марке и VIN для европейских, японских и корейских автомобилей. Адрес магазина —
          ул. Маршала Кошевого, 25. Установку на сервисе делаем отдельно, на Октябрьском шоссе.
        </p>

        <ul class="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:mt-8 md:gap-3 md:grid-cols-1 lg:grid-cols-2">
          <CheckItem v-for="item in items" :key="item.slug" variant="boxed">
            {{ item.title }}
          </CheckItem>
        </ul>

        <div class="mt-6 flex justify-end md:mt-10">
          <NavButton to="/store">Подробнее</NavButton>
        </div>
      </div>
    </div>
  </section>
</template>
