<script setup lang="ts">
import {
  formatReviewDate,
  reviewInitials,
  type Review,
} from '~/data/reviews'
import { getLocation, yandexReviewsUrl } from '~/data/site'

const props = defineProps<{
  item: Review
  expanded: boolean
  minHeight?: number
  /** Stagger delay for entrance animation, ms */
  appearDelay?: number
}>()

defineEmits<{
  toggle: []
}>()

const COLLAPSED_LINES = 4
/** Rough start so full text doesn't flash before measure */
const INITIAL_COLLAPSED = `${Math.round(0.95 * 16 * 1.625 * COLLAPSED_LINES)}px`

const textEl = ref<HTMLElement | null>(null)
const maxHeight = ref(INITIAL_COLLAPSED)
const needsToggle = ref(false)
const collapsedPx = ref(0)
let reduceMotion = false

const cardStyle = computed(() => {
  const style: Record<string, string> = {}
  if (!props.expanded && props.minHeight) {
    style.minHeight = `${props.minHeight}px`
  }
  if (props.appearDelay) {
    style['--review-delay'] = `${props.appearDelay}ms`
  }
  return Object.keys(style).length ? style : undefined
})

function lineHeightPx(el: HTMLElement) {
  const lh = parseFloat(getComputedStyle(el).lineHeight)
  return Number.isFinite(lh) ? lh : 24
}

function measure() {
  const el = textEl.value
  if (!el) return

  const full = el.scrollHeight
  const collapsed = Math.round(lineHeightPx(el) * COLLAPSED_LINES)
  collapsedPx.value = collapsed
  needsToggle.value = full > collapsed + 2

  if (props.expanded || !needsToggle.value) {
    maxHeight.value = `${full}px`
  }
  else {
    maxHeight.value = `${collapsed}px`
  }
}

async function applyExpanded(isOpen: boolean) {
  const el = textEl.value
  if (!el) return

  if (reduceMotion) {
    measure()
    return
  }

  if (isOpen) {
    // Animate from current collapsed height → full (px to px; "none" breaks transition)
    const collapsed = collapsedPx.value || Math.round(lineHeightPx(el) * COLLAPSED_LINES)
    maxHeight.value = `${collapsed}px`
    await nextTick()
    requestAnimationFrame(() => {
      maxHeight.value = `${el.scrollHeight}px`
    })
    return
  }

  maxHeight.value = `${el.scrollHeight}px`
  await nextTick()
  requestAnimationFrame(() => {
    maxHeight.value = `${collapsedPx.value || Math.round(lineHeightPx(el) * COLLAPSED_LINES)}px`
  })
}

watch(
  () => props.expanded,
  (isOpen) => {
    applyExpanded(isOpen)
  },
)

watch(
  () => props.item.text,
  () => nextTick(measure),
)

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  measure()
  window.addEventListener('resize', measure)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <article
    class="review-card-appear g-card flex w-full flex-col p-5 md:p-6"
    :data-review-card="item.id"
    :style="cardStyle"
  >
    <div class="flex gap-3">
      <span
        class="g-display flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-yellow text-sm font-bold"
        aria-hidden="true"
      >
        {{ reviewInitials(item.author) }}
      </span>

      <div class="min-w-0 flex-1">
        <p class="truncate font-bold leading-snug">
          {{ item.author }}
        </p>
        <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <div
            class="flex items-center gap-0.5"
            :aria-label="`Оценка ${item.rating} из 5`"
          >
            <svg
              v-for="n in 5"
              :key="n"
              viewBox="0 0 24 24"
              class="size-4 shrink-0"
              :class="n <= item.rating ? 'text-yellow' : 'text-ink/15'"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                stroke="var(--g-ink)"
                stroke-width="1.1"
                stroke-linejoin="round"
                d="M12 2.5l2.9 6.1 6.7.7-5 4.6 1.4 6.6L12 17.3 5.9 20.5l1.4-6.6-5-4.6 6.7-.7L12 2.5z"
              />
            </svg>
          </div>
          <p class="text-sm text-muted">
            {{ formatReviewDate(item.date) }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 text-[0.95rem] leading-relaxed text-ink/90">
      <div
        class="overflow-hidden transition-[max-height] duration-300 ease-out motion-reduce:transition-none"
        :style="{ maxHeight }"
      >
        <p ref="textEl">
          {{ item.text }}
        </p>
      </div>
      <button
        v-if="needsToggle"
        type="button"
        class="mt-1 font-bold text-muted underline-offset-2 hover:text-ink hover:underline"
        @click="$emit('toggle')"
      >
        {{ expanded ? 'Свернуть' : 'Ещё' }}
      </button>
    </div>

    <div class="mt-auto border-t-2 border-line pt-4">
      <a
        :href="item.url ?? yandexReviewsUrl(getLocation(item.locationId))"
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
        >
        <span>Яндекс&nbsp;Карты</span>
      </a>
    </div>
  </article>
</template>

<style scoped>
.review-card-appear {
  animation: review-card-in 0.45s ease both;
  animation-delay: var(--review-delay, 0ms);
}

@keyframes review-card-in {
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .review-card-appear {
    animation: none;
  }
}
</style>
