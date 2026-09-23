<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string
    badge?: string
    desktop?: 'para' | 'chevron'
    desktopAspect?: string
  }>(),
  {
    badge: undefined,
    desktop: 'para',
    desktopAspect: 'aspect-square',
  },
)
</script>

<template>
  <div class="w-full">
    <!-- Mobile: rectangle + hard shadow (same language as buttons/cards) -->
    <div class="relative pr-1.5 pb-1.5 md:hidden">
      <img
        :src="src"
        alt=""
        class="aspect-[3/2] w-full border-2 border-ink bg-canvas object-cover shadow-hard"
        loading="lazy"
      />
      <span
        v-if="badge"
        class="absolute bottom-3 left-0 z-10 bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-yellow"
      >
        {{ badge }}
      </span>
    </div>

    <div
      v-if="desktop === 'para'"
      class="relative hidden w-full md:block"
      :class="desktopAspect"
    >
      <div
        class="g-para-r absolute inset-y-0 right-0 w-[78%] translate-x-3 translate-y-3 bg-ink"
        aria-hidden="true"
      />
      <div class="g-para-r absolute inset-y-0 right-0 w-[78%] bg-yellow" aria-hidden="true" />
      <img
        :src="src"
        alt=""
        class="g-para-l absolute inset-y-[6%] left-0 h-[88%] w-[88%] bg-canvas object-cover object-[44%_50%]"
        loading="lazy"
      />
      <span class="absolute bottom-0 right-[6%] h-10 w-10 bg-ink" aria-hidden="true" />
    </div>

    <div
      v-else
      class="relative hidden w-full md:block"
      :class="desktopAspect"
    >
      <div
        class="g-chevron absolute inset-y-0 left-[-8%] w-[80%] translate-x-3 translate-y-3 bg-ink"
        aria-hidden="true"
      />
      <div
        class="g-chevron absolute inset-y-0 left-[-10%] w-[80%] bg-yellow"
        aria-hidden="true"
      />
      <img
        :src="src"
        alt=""
        class="g-para absolute inset-y-[6%] left-[14%] h-[88%] w-[86%] bg-canvas object-cover"
        loading="lazy"
      />
      <span class="g-tri-tl absolute left-0 top-0 h-16 w-16 bg-ink" aria-hidden="true" />
    </div>
  </div>
</template>
