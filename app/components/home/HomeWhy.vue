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
    title: 'Режим',
    text: `${hours.weekdays}. ${hours.weekend}`,
  },
]
</script>

<template>
  <section class="relative overflow-hidden bg-canvas">
    <div class="g-container g-section">
      <div class="mb-5 max-w-2xl md:mb-6 lg:mb-8">
        <p class="g-label">Почему мы</p>
        <h2 class="g-h g-h2">
          Работаем по записи,
          <br class="hidden md:block" />
          с <b>гарантией</b> на работы и детали
        </h2>
      </div>

      <SnapSwiper :items="items" label="Почему мы">
        <template #default="{ item }">
          <article
            class="g-radius flex h-full w-full flex-col border-2 border-ink bg-white p-5 md:p-6"
          >
            <div class="flex items-center gap-3.5">
              <span class="g-tile h-11 w-11 shrink-0">
                <Icon :name="item.icon" class="size-5" />
              </span>
              <h3 class="g-display text-[1.4rem] font-bold leading-[1.1] text-ink md:text-[1.65rem]">
                {{ item.title }}
              </h3>
            </div>
            <p class="mt-4 text-[0.95rem] leading-relaxed text-ink/90">
              {{ item.text }}
            </p>
          </article>
        </template>
      </SnapSwiper>
    </div>
  </section>
</template>
