<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <!--
    Same dark band language as HomeCta / HomeServices:
    ink field, yellow slab, on-dark type — not an empty white banner.
  -->
  <section class="relative overflow-hidden bg-ink text-white">
    <div
      class="g-para pointer-events-none absolute inset-y-0 right-[-10%] hidden w-[36%] bg-yellow lg:block"
      aria-hidden="true"
    />
    <span
      class="g-tri-tr absolute right-0 top-0 h-16 w-16 bg-yellow md:hidden"
      aria-hidden="true"
    />
    <span
      class="g-tri-tl absolute left-0 top-0 hidden h-16 w-16 bg-ink-2 lg:block"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <p class="g-label text-yellow">
        {{ label }}
      </p>
      <h1 class="g-h on-dark max-w-3xl text-4xl leading-[1.08] md:text-5xl lg:text-6xl">
        <slot name="title" />
      </h1>
      <p
        v-if="$slots.lead"
        class="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 md:mt-6 md:text-base"
      >
        <slot name="lead" />
      </p>
      <div
        v-if="$slots.actions"
        class="mt-7 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4 md:mt-8 [&>.phone]:text-white"
      >
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
