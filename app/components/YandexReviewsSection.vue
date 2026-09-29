<script setup lang="ts">
import { reviews } from '~/data/reviews'

const DESKTOP_PREVIEW = 3

const sectionEl = ref<HTMLElement | null>(null)
const expanded = ref<Record<string, boolean>>({})
const showAllDesktop = ref(false)
/** Shared height for collapsed cards so a row stays even */
const collapsedMinHeight = ref<number>()

const desktopReviews = computed(() =>
  showAllDesktop.value ? reviews : reviews.slice(0, DESKTOP_PREVIEW),
)

const hasMoreDesktop = computed(
  () => !showAllDesktop.value && reviews.length > DESKTOP_PREVIEW,
)

function measureCollapsedHeight() {
  nextTick(async () => {
    await nextTick()
    const root = sectionEl.value
    if (!root) return

    const cards = [
      ...root.querySelectorAll<HTMLElement>('[data-review-card]'),
    ].filter(el => {
      const id = el.dataset.reviewCard
      return Boolean(id) && el.offsetParent !== null && !expanded.value[id!]
    })

    if (!cards.length) return

    const prev = collapsedMinHeight.value
    collapsedMinHeight.value = undefined
    await nextTick()

    const max = Math.max(0, ...cards.map(el => el.offsetHeight))
    collapsedMinHeight.value = max > 0 ? Math.ceil(max) : prev
  })
}

function toggle(id: string) {
  expanded.value = { ...expanded.value, [id]: !expanded.value[id] }
}

function revealDesktop() {
  showAllDesktop.value = true
  window.setTimeout(measureCollapsedHeight, 500)
}

onMounted(() => {
  measureCollapsedHeight()
  window.addEventListener('resize', measureCollapsedHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureCollapsedHeight)
})
</script>

<template>
  <section ref="sectionEl" class="bg-canvas">
    <div class="g-container g-section">
      <div class="mb-5 max-w-2xl md:mb-6 lg:mb-8">
        <p class="g-label">Отзывы</p>
        <h2 class="g-h g-h2">
          Отзывы наших клиентов
        </h2>
      </div>

      <SnapSwiper
        mobile-only
        :items="reviews"
        label="Отзывы клиентов"
        :item-key="(item) => item.id"
      >
        <template #default="{ item, index }">
          <ReviewCard
            :item="item"
            :expanded="Boolean(expanded[item.id])"
            :min-height="collapsedMinHeight"
            :appear-delay="index * 70"
            @toggle="toggle(item.id)"
          />
        </template>
      </SnapSwiper>

      <div class="hidden lg:block">
        <div class="grid grid-cols-3 items-start gap-4">
          <ReviewCard
            v-for="(item, i) in desktopReviews"
            :key="item.id"
            :item="item"
            :expanded="Boolean(expanded[item.id])"
            :min-height="collapsedMinHeight"
            :appear-delay="i * 70"
            @toggle="toggle(item.id)"
          />
        </div>

        <div v-if="hasMoreDesktop" class="mt-6 flex justify-center">
          <AppButton type="button" variant="ghost" @click="revealDesktop">
            Ещё отзывы
            <Icon name="lucide:chevron-down" class="size-4" />
          </AppButton>
        </div>
      </div>
    </div>
  </section>
</template>
