<script setup lang="ts">
import type { Location } from '~/data/site'
import { yandexOrgWidgetUrl } from '~/data/site'

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
    Mobile: one card — Yandex link / address / map.
    Desktop: two separate cards.
  -->
  <section>
    <!-- Mobile -->
    <div
      class="overflow-hidden rounded-[var(--g-radius)] border-2 border-ink bg-white lg:hidden"
    >
      <!-- 1. Yandex Maps -->
      <div class="px-4 py-3">
        <a
          :href="location.yandexUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-sm font-bold leading-none text-ink underline-offset-2 hover:underline"
        >
          <img
            src="/Yandex_znak.svg"
            alt=""
            width="18"
            height="18"
            class="block size-[18px] shrink-0"
            decoding="async"
          />
          <span>Яндекс&nbsp;Карты</span>
        </a>
      </div>

      <!-- 2. Address -->
      <div class="border-t-2 border-line px-5 py-5">
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

      <!-- 3. Map -->
      <div class="h-[220px] bg-canvas sm:h-[260px]">
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

    <!-- Desktop -->
    <div class="hidden lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
      <div
        class="self-start rounded-[var(--g-radius)] border-2 border-ink bg-white p-7"
      >
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

      <div
        class="flex flex-col overflow-hidden rounded-[var(--g-radius)] border-2 border-ink bg-white"
      >
        <div class="border-b-2 border-ink px-5 py-3 text-sm">
          <a
            :href="location.yandexUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-sm font-bold leading-none text-ink underline-offset-2 hover:underline"
          >
            <img
              src="/Yandex_znak.svg"
              alt=""
              width="18"
              height="18"
              class="block size-[18px] shrink-0"
              decoding="async"
            />
            <span>Яндекс&nbsp;Карты</span>
          </a>
        </div>

        <div class="bg-canvas lg:h-[var(--map-h)]" :style="{ '--map-h': height }">
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
    </div>
  </section>
</template>
