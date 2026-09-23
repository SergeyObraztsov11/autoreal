<script setup lang="ts">
import type { Location } from '~/data/site'
import { yandexOrgWidgetUrl, yandexRouteUrl } from '~/data/site'

const props = withDefaults(
  defineProps<{
    location: Location
    /** Map height from lg and up */
    height?: string
  }>(),
  {
    height: '460px',
  },
)

const src = computed(() => yandexOrgWidgetUrl(props.location))
</script>

<template>
  <!--
    Mobile: stacked halves share one outline (info has no bottom border).
    Desktop: two separate cards; section itself has no border/shadow.
  -->
  <section class="lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
    <div
      class="border-2 border-b-0 border-ink bg-white px-4 py-4 lg:self-start lg:border-b-2 lg:p-7 lg:shadow-hard"
    >
      <!-- Mobile: short block -->
      <div class="lg:hidden">
        <p class="text-xs font-bold uppercase tracking-[0.14em] text-muted">
          {{ location.label }}
        </p>
        <p class="mt-2 text-lg font-bold leading-snug">
          {{ location.address }}
        </p>
        <p class="mt-1.5 text-sm text-muted">
          {{ location.hours.weekdays }} · {{ location.hours.weekend }}
        </p>
        <PhoneLink :number="location.phone" class="mt-3 inline-block text-base font-bold" />
        <p class="mt-3 text-[13px] leading-relaxed text-muted">
          {{ location.hint }}
        </p>
      </div>

      <!-- Desktop: full card content -->
      <div class="hidden lg:block">
        <div class="flex items-center gap-4">
          <span class="g-tile h-12 w-12 shrink-0">
            <Icon :name="location.icon" class="size-5" />
          </span>
          <div>
            <p class="g-kicker">
              {{ location.label }}
            </p>
            <h2 class="g-display mt-0.5 text-2xl font-bold">
              {{ location.title }}
            </h2>
          </div>
        </div>

        <dl class="mt-5 space-y-4 text-sm">
          <div>
            <dt class="g-kicker">Адрес</dt>
            <dd class="mt-1 font-semibold">г. Волгодонск, {{ location.address }}</dd>
            <dd class="mt-1 text-muted">
              {{ location.hint }}
            </dd>
          </div>
          <div>
            <dt class="g-kicker">Режим работы</dt>
            <dd class="mt-1 font-semibold">
              {{ location.hours.weekdays }}
            </dd>
            <dd class="font-semibold">
              {{ location.hours.weekend }}
            </dd>
          </div>
          <div>
            <dt class="g-kicker">Телефон</dt>
            <dd class="mt-1">
              <PhoneLink :number="location.phone" class="text-lg font-bold" />
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div
      class="flex flex-col overflow-hidden border-2 border-ink bg-white shadow-hard-sm lg:shadow-hard"
    >
      <div
        class="order-2 grid grid-cols-2 border-t border-line text-sm lg:order-1 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:border-b-2 lg:border-t-0 lg:border-ink lg:px-5 lg:py-3"
      >
        <a
          :href="location.yandexUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="px-3 py-3 text-center font-semibold text-ink underline-offset-2 hover:underline lg:px-0 lg:py-0 lg:text-left lg:g-link-accent"
        >
          Яндекс.Карты
        </a>
        <a
          :href="yandexRouteUrl(location)"
          target="_blank"
          rel="noopener noreferrer"
          class="border-l border-line px-3 py-3 text-center font-bold text-ink underline-offset-2 hover:underline lg:border-0 lg:px-0 lg:py-0 lg:text-right lg:g-link-accent lg:underline"
        >
          Маршрут
        </a>
      </div>

      <div
        class="order-1 h-[220px] bg-canvas sm:h-[260px] lg:order-2 lg:h-[var(--map-h)]"
        :style="{ '--map-h': height }"
      >
        <ClientOnly>
          <iframe
            :src="src"
            :title="`Яндекс.Карты — ${location.title}`"
            class="h-full w-full border-0"
            loading="lazy"
            allowfullscreen
          />
          <template #fallback>
            <div class="flex h-full items-center justify-center text-sm text-muted">
              Загрузка карты…
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
