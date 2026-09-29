<script setup lang="ts">
import { phones } from '~/data/site'
</script>

<template>
  <section class="relative overflow-hidden bg-ink text-white">
    <div
      class="g-para pointer-events-none absolute inset-y-0 right-[-10%] hidden w-[32%] bg-yellow lg:block"
      aria-hidden="true"
    />
    <span
      class="g-tri-tr absolute right-0 top-0 h-14 w-14 bg-yellow md:hidden"
      aria-hidden="true"
    />

    <div class="g-container g-section relative flex flex-col items-start justify-between gap-5 md:gap-6 lg:flex-row lg:items-center lg:gap-12">
      <div class="max-w-xl">
        <p class="g-label text-yellow">Запись</p>
        <h2 class="g-h g-h2 on-dark">
          Запишитесь на ремонт
          или <b>диагностику</b>
        </h2>
        <p class="mt-4 text-[1.0625rem] leading-relaxed text-white/75 md:text-lg">
          Оставьте номер — перезвоним в рабочее время и подберём время на сервисе.
        </p>
      </div>

      <div class="grid w-full gap-4 lg:w-auto lg:justify-items-end">
        <PhoneLink :number="phones.service" class="text-2xl font-bold text-white lg:text-[1.75rem]" />
        <div class="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
          <CallbackButton class="w-full sm:w-auto" />
          <div class="lg:hidden">
            <CallButton :number="phones.service" variant="dark" class="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
