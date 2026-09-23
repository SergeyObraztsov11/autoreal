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
  <li v-if="variant === 'home'" class="g-card flex h-full flex-col p-3.5 sm:p-6">
    <div class="flex items-center gap-3">
      <span class="g-tile h-9 w-9 shrink-0 sm:h-11 sm:w-11">
        <Icon :name="location.icon" class="size-4 sm:size-5" />
      </span>
      <div class="min-w-0">
        <p class="g-kicker">
          {{ location.label }}
        </p>
        <p class="g-display text-sm font-bold leading-snug sm:text-lg">
          {{ location.address }}
        </p>
      </div>
    </div>

    <p class="mt-3 text-sm leading-snug text-muted">
      {{ location.hint }}
    </p>
    <p class="mt-2 text-sm text-muted">
      {{ location.hours.weekdays }} · {{ location.hours.weekend }}
    </p>
    <div class="mt-2 hidden lg:block">
      <PhoneLink :number="location.phone" class="text-sm font-bold" />
    </div>

    <div class="mt-4 grid grid-cols-2 gap-3 lg:hidden">
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
    <p class="mt-1.5 text-white/80">
      {{ location.hours.weekdays }} · {{ location.hours.weekend }}
    </p>
    <p class="phone mt-1.5 text-white/80">
      {{ location.phone }}
    </p>
  </div>
</template>
