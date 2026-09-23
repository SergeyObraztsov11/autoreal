<script setup lang="ts">
import { phones } from '~/data/site'
</script>

<template>
  <section class="g-cut-top-r relative overflow-hidden bg-ink text-white">
    <div
      class="g-para pointer-events-none absolute inset-y-0 right-[-8%] hidden w-[40%] bg-yellow lg:block"
      aria-hidden="true"
    />
    <span
      class="g-tri-tl absolute left-0 top-0 hidden h-20 w-20 bg-ink-2 lg:block"
      aria-hidden="true"
    />

    <div
      class="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 pb-10 pt-16 md:flex-row md:items-center md:gap-8 md:px-6 md:py-20"
    >
      <div class="max-w-xl">
        <h2 class="g-h on-dark text-3xl leading-[1.12] md:text-5xl md:leading-[1.08]">
          Запись на ремонт
          <br class="hidden md:block" />
          или <b>диагностику</b>.
        </h2>
        <p class="mt-3 text-[15px] leading-relaxed text-white/70 md:text-sm">
          Оставьте номер — перезвоним в рабочее время и подберём время на сервисе.
        </p>
      </div>
      <div class="grid w-full gap-3 sm:w-auto sm:flex sm:flex-wrap sm:items-center sm:gap-5">
        <PhoneLink :number="phones.service" class="text-lg font-bold text-white sm:text-lg" />
        <CallbackButton class="w-full sm:w-auto" />
      </div>
    </div>
  </section>
</template>
