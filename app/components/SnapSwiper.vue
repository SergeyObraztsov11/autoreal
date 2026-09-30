<script setup lang="ts" generic="T">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { A11y, FreeMode, Mousewheel } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'

import 'swiper/css'
import 'swiper/css/free-mode'

const props = withDefaults(
  defineProps<{
    items: T[]
    label: string
    tone?: 'light' | 'dark'
    gridClass?: string
    itemKey?: (item: T, index: number) => string | number
    /** Skip desktop grid — parent renders lg layout itself */
    mobileOnly?: boolean
    /** Carousel at all breakpoints (no desktop grid) */
    forceCarousel?: boolean
    /** Slide width utilities (rem/px/vw — not % of parent) */
    slideClass?: string
  }>(),
  {
    tone: 'light',
    gridClass: 'lg:grid-cols-4 lg:gap-4',
    itemKey: undefined,
    mobileOnly: false,
    forceCarousel: false,
    slideClass: 'w-[min(19.5rem,calc(100vw-3rem))] md:w-[21rem]',
  },
)

const modules = [A11y, FreeMode, Mousewheel]

const isBeginning = ref(true)
const isEnd = ref(false)
const canScroll = ref(false)
/** 0…1 how far the track has been scrolled */
const progress = ref(0)

function keyOf(item: T, index: number) {
  if (props.itemKey) return props.itemKey(item, index)
  if (item && typeof item === 'object') {
    const rec = item as Record<string, unknown>
    if (typeof rec.slug === 'string') return rec.slug
    if (typeof rec.title === 'string') return rec.title
  }
  return index
}

const showDesktopGrid = computed(() => !props.mobileOnly && !props.forceCarousel)

function syncEdges(swiper: SwiperInstance) {
  isBeginning.value = swiper.isBeginning
  isEnd.value = swiper.isEnd
  canScroll.value = !swiper.isLocked
}

function onSwiper(swiper: SwiperInstance) {
  syncEdges(swiper)
  progress.value = swiper.progress
}

function onProgress(swiper: SwiperInstance) {
  syncEdges(swiper)
  progress.value = Math.min(1, Math.max(0, swiper.progress))
}
</script>

<template>
  <div>
    <div
      class="snap-swiper -mx-5 px-5 md:-mx-6 md:px-6"
      :class="[
        tone === 'dark' ? 'snap-swiper--dark' : undefined,
        forceCarousel ? undefined : 'lg:hidden',
      ]"
    >
      <div class="relative">
        <ClientOnly>
          <Swiper
            :modules="modules"
            :slides-per-view="'auto'"
            :space-between="14"
            :grab-cursor="true"
            :watch-overflow="true"
            :free-mode="{ enabled: true, sticky: true }"
            :mousewheel="{
              forceToAxis: true,
              releaseOnEdges: true,
              sensitivity: 0.85,
            }"
            :a11y="{
              enabled: true,
              containerMessage: label,
              containerRoleDescriptionMessage: 'карусель',
            }"
            :breakpoints="{
              768: { spaceBetween: 16 },
            }"
            @swiper="onSwiper"
            @progress="onProgress"
            @reach-beginning="onProgress"
            @reach-end="onProgress"
            @from-edge="onProgress"
            @to-edge="onProgress"
          >
            <SwiperSlide v-for="(item, i) in items" :key="keyOf(item, i)">
              <div class="flex h-full" :class="slideClass">
                <slot :item="item" :index="i" />
              </div>
            </SwiperSlide>
          </Swiper>

          <template #fallback>
            <div class="flex gap-3.5 overflow-hidden md:gap-4">
              <div
                v-for="(item, i) in items.slice(0, 3)"
                :key="keyOf(item, i)"
                class="shrink-0"
                :class="slideClass"
              >
                <slot :item="item" :index="i" />
              </div>
            </div>
          </template>
        </ClientOnly>

        <div
          class="pointer-events-none absolute inset-y-0 left-0 z-20 w-14 transition-opacity duration-300 md:w-16"
          :class="[
            tone === 'dark' ? 'snap-fade-dark-l' : 'snap-fade-light-l',
            canScroll && !isBeginning ? 'opacity-100' : 'opacity-0',
          ]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 transition-opacity duration-300 md:w-20"
          :class="[
            tone === 'dark' ? 'snap-fade-dark-r' : 'snap-fade-light-r',
            canScroll && !isEnd ? 'opacity-100' : 'opacity-0',
          ]"
          aria-hidden="true"
        />
      </div>

      <!-- Slim progress track — shows more content without a caption -->
      <div
        v-if="canScroll"
        class="mx-auto mt-3 h-1 w-16 overflow-hidden rounded-full"
        :class="tone === 'dark' ? 'bg-white/15' : 'bg-ink/10'"
        aria-hidden="true"
      >
        <div
          class="h-full w-1/2 rounded-full bg-yellow transition-transform duration-150 ease-out"
          :style="{ transform: `translateX(${progress * 100}%)` }"
        />
      </div>
    </div>

    <div v-if="showDesktopGrid" class="hidden lg:grid" :class="gridClass">
      <slot v-for="(item, i) in items" :key="keyOf(item, i)" :item="item" :index="i" />
    </div>
  </div>
</template>

<style scoped>
.snap-swiper :deep(.swiper) {
  padding-bottom: 0.75rem;
}

.snap-swiper :deep(.swiper-wrapper) {
  align-items: stretch;
}

/* slidesPerView:auto — size from inner width, not Swiper's width:100% */
.snap-swiper :deep(.swiper-slide) {
  box-sizing: border-box;
  width: auto !important;
  height: auto;
}

.snap-fade-light-r {
  background: linear-gradient(
    to right,
    transparent 0%,
    color-mix(in srgb, var(--g-bg) 35%, transparent) 45%,
    color-mix(in srgb, var(--g-bg) 78%, transparent) 78%,
    var(--g-bg) 100%
  );
}
.snap-fade-light-l {
  background: linear-gradient(
    to left,
    transparent 0%,
    color-mix(in srgb, var(--g-bg) 35%, transparent) 45%,
    color-mix(in srgb, var(--g-bg) 78%, transparent) 78%,
    var(--g-bg) 100%
  );
}
.snap-fade-dark-r {
  background: linear-gradient(
    to right,
    transparent 0%,
    color-mix(in srgb, var(--g-ink) 35%, transparent) 45%,
    color-mix(in srgb, var(--g-ink) 78%, transparent) 78%,
    var(--g-ink) 100%
  );
}
.snap-fade-dark-l {
  background: linear-gradient(
    to left,
    transparent 0%,
    color-mix(in srgb, var(--g-ink) 35%, transparent) 45%,
    color-mix(in srgb, var(--g-ink) 78%, transparent) 78%,
    var(--g-ink) 100%
  );
}
</style>
