<script setup lang="ts">
import { media } from '~/data/media'
import { servicesByDivision } from '~/data/services'

const items = servicesByDivision('store').slice(0, 6)
</script>

<template>
  <section id="store" class="relative scroll-mt-20 overflow-hidden bg-canvas">
    <SectionSplit>
      <p class="g-label">Магазин</p>
      <h2 class="g-h g-h2">
        Автозапчасти —
        со склада и <b>под заказ</b>
      </h2>

      <p class="g-lead mt-5">
        Подбор по марке и VIN. Адрес магазина — ул. Маршала Кошевого, 25. Установку делаем на
        сервисе, на Октябрьском шоссе.
      </p>

      <template #media>
        <SectionPhoto :src="media.home.store" :framed="false" />
      </template>

      <template #body>
        <ul class="grid gap-3 sm:grid-cols-2">
          <CheckItem v-for="item in items" :key="item.slug" variant="boxed">
            {{ item.title }}
          </CheckItem>
        </ul>

        <div class="mt-8">
          <NavButton to="/store" class="w-full md:w-auto">В магазин</NavButton>
        </div>
      </template>
    </SectionSplit>
  </section>
</template>
