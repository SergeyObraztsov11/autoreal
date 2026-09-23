<script setup lang="ts">
import { hours } from '~/data/site'

const items = [
  {
    icon: 'lucide:shield-check',
    title: 'Гарантия',
    text: 'На выполненные работы и установленные детали',
  },
  {
    icon: 'lucide:package-check',
    title: 'Свой склад',
    text: 'Запчасти для ремонта — со склада нашего магазина',
  },
  {
    icon: 'lucide:calendar-check',
    title: 'Запись',
    text: 'Принимаем по предварительной записи, без живой очереди',
  },
  {
    icon: 'lucide:clock',
    title: 'Режим работы',
    text: `${hours.weekdays}. ${hours.weekend}`,
  },
]
</script>

<template>
  <section class="g-cut-top-l relative overflow-hidden bg-yellow">
    <span
      class="g-tri-br absolute bottom-0 right-0 hidden h-40 w-64 bg-ink lg:block"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-7xl px-4 pb-10 pt-16 md:px-6 md:py-24">
      <div class="mb-6 max-w-2xl md:mb-12">
        <h2 class="g-h on-yellow text-3xl leading-[1.12] md:text-5xl md:leading-[1.08] lg:text-6xl">
          Работаем по записи,
          <br class="hidden md:block" />
          с <b>гарантией</b> на работы и детали.
        </h2>
      </div>

      <ul class="grid gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:grid-cols-4">
        <li
          v-for="it in items"
          :key="it.title"
          class="g-card flex h-full flex-col p-3.5 sm:p-6"
        >
          <div class="flex items-center gap-3">
            <span class="g-tile h-9 w-9 shrink-0 sm:h-11 sm:w-11">
              <Icon :name="it.icon" class="size-4 sm:size-5" />
            </span>
            <h3 class="g-display text-sm font-bold leading-snug sm:text-lg">
              {{ it.title }}
            </h3>
          </div>
          <p class="mt-3 text-sm leading-snug text-muted sm:leading-relaxed">
            {{ it.text }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
