<script setup lang="ts">
import type { Location } from '~/data/site'

withDefaults(
  defineProps<{
    location: Location
    /** home — карточка на главной; footer — тёмная колонка */
    variant?: 'home' | 'footer'
  }>(),
  { variant: 'home' },
)
</script>

<template>
  <!-- Home: card with mobile call/route CTAs -->
  <li v-if="variant === 'home'" class="g-card flex h-full flex-col p-5 md:p-6">
    <div class="flex items-center gap-3.5">
      <span class="g-tile h-11 w-11 shrink-0">
        <Icon :name="location.icon" class="size-5" />
      </span>
      <div class="min-w-0">
        <p class="g-kicker">
          {{ location.label }}
        </p>
        <p class="g-display text-lg font-bold leading-snug">
          {{ location.address }}
        </p>
      </div>
    </div>

    <p class="mt-4 text-[0.95rem] leading-relaxed text-muted">
      {{ location.hint }}
    </p>
    <p class="phone mt-2 text-sm font-bold">
      {{ location.hours.weekdays }} · {{ location.hours.weekend }}
    </p>
    <div class="mt-2 hidden items-center gap-2 lg:flex">
      <Icon name="lucide:phone" class="size-4 shrink-0" />
      <PhoneLink :number="location.phone" class="text-sm font-bold" />
    </div>

    <div class="mt-5 grid grid-cols-2 gap-3 lg:hidden">
      <CallButton :number="location.phone" variant="primary" />
      <RouteButton :location="location" />
    </div>
  </li>

  <!-- Footer: dark column -->
  <div v-else class="text-sm font-normal leading-relaxed">
    <p class="g-kicker flex h-8 items-end text-yellow">
      {{ location.label }}
    </p>
    <p class="mt-4 text-white/80">
      {{ location.address }}
    </p>
    <p class="mt-1.5 text-white/80">{{ location.hours.weekdays }} · {{ location.hours.weekend }}</p>
    <p class="phone mt-1.5 text-white/80">
      {{ location.phone }}
    </p>
  </div>
</template>
