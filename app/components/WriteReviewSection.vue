<script setup lang="ts">
const { show } = useReviewModal()
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

    <div
      class="g-container g-section relative flex flex-col items-start justify-between gap-5 md:gap-6 lg:flex-row lg:items-center lg:gap-12"
    >
      <div class="max-w-xl">
        <p class="g-label text-yellow">Ваш отзыв</p>
        <h2 class="g-h g-h2 on-dark">
          Были у нас?
          <b>Напишите</b>, как всё прошло
        </h2>
        <p class="mt-4 text-[1.0625rem] leading-relaxed text-white/75 md:text-lg">
          Нам важно знать, как всё прошло — ваш отзыв помогает становиться лучше.
        </p>
      </div>

      <AppButton
        type="button"
        class="w-full shrink-0 sm:w-auto"
        @click="show"
      >
        <Icon name="lucide:square-pen" class="size-[1.125rem] shrink-0" />
        Написать отзыв
      </AppButton>
    </div>
  </section>
</template>
