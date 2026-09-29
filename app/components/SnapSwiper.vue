<script setup lang="ts" generic="T">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { A11y, FreeMode, Mousewheel } from 'swiper/modules'

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
</style>
