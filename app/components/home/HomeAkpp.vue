<script setup lang="ts">
import { media } from '~/data/media'

const points = [
  'Полная замена жидкости через аппарат',
  'Оригинальное ATF или одобренные аналоги',
  'Промывка и замена фильтра при необходимости',
]
</script>

<template>
  <section id="akpp" class="relative scroll-mt-20 overflow-hidden">
    <span class="absolute left-0 top-16 hidden h-16 w-24 bg-ink lg:block" aria-hidden="true" />
    <span class="absolute left-0 top-16 hidden h-16 w-20 bg-yellow lg:block" aria-hidden="true" />

    <div
      class="relative mx-auto max-w-7xl px-4 py-10 md:grid md:grid-cols-2 md:items-center md:gap-x-8 md:px-6 md:py-20 lg:gap-x-10 lg:py-28"
    >
      <div class="max-w-xl md:col-start-1">
        <h2 class="g-h text-3xl leading-[1.12] md:text-5xl md:leading-[1.08] lg:text-6xl">
          Аппаратная замена масла
          <br class="hidden md:block" />
          в&nbsp;АКПП — <b>в день записи</b>.
        </h2>
      </div>

      <div class="mt-5 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:self-center">
        <SectionPhoto :src="media.home.akpp" desktop="para" />
      </div>

      <div class="mt-5 max-w-xl md:col-start-1 md:mt-6">
        <p class="text-[15px] leading-relaxed text-muted md:max-w-md md:text-base">
          Полная замена ATF через аппарат. При необходимости — промывка системы и замена фильтра.
          Работы выполняем на техцентре по предварительной записи.
        </p>

        <ul class="mt-5 grid gap-2.5 md:mt-8 md:gap-3 md:grid-cols-1 lg:grid-cols-2">
          <CheckItem v-for="p in points" :key="p" variant="boxed">
            {{ p }}
          </CheckItem>
        </ul>

        <div class="mt-6 flex justify-end md:mt-10">
          <NavButton to="/service#akpp-oil">Подробнее</NavButton>
        </div>
      </div>
    </div>
  </section>
</template>
