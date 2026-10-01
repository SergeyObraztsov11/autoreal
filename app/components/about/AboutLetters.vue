<script setup lang="ts">
import { media } from '~/data/media'

const items = media.letters.map((src, i) => ({
  id: `letter-${i + 1}`,
  src,
}))

const activeIndex = ref<number | null>(null)
const lightboxOpen = computed(() => activeIndex.value !== null)
const activeItem = computed(() =>
  activeIndex.value === null ? null : (items[activeIndex.value] ?? null),
)

const dragX = ref(0)
const dragging = ref(false)
const stageEl = ref<HTMLElement | null>(null)

let startX = 0
let startY = 0
let axis: 'x' | 'y' | null = null
let tracking = false

useScrollLock(lightboxOpen)

function openLightbox(index: number) {
  activeIndex.value = index
  dragX.value = 0
}

function closeLightbox() {
  activeIndex.value = null
  dragX.value = 0
  dragging.value = false
  tracking = false
  axis = null
}

function goPrev() {
  if (activeIndex.value === null || items.length < 2) return
  activeIndex.value = (activeIndex.value - 1 + items.length) % items.length
  dragX.value = 0
}

function goNext() {
  if (activeIndex.value === null || items.length < 2) return
  activeIndex.value = (activeIndex.value + 1) % items.length
  dragX.value = 0
}

function onLightboxKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') goPrev()
  else if (e.key === 'ArrowRight') goNext()
}

function beginTrack(x: number, y: number) {
  tracking = true
  dragging.value = true
  startX = x
  startY = y
  axis = null
  dragX.value = 0
}

function moveTrack(x: number, y: number, e?: Event) {
  if (!tracking) return
  const dx = x - startX
  const dy = y - startY

  if (!axis) {
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
    axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y'
    if (axis === 'y') {
      tracking = false
      dragging.value = false
      dragX.value = 0
      return
    }
  }

  if (axis === 'x') {
    dragX.value = dx
    e?.preventDefault()
  }
}

function endTrack() {
  const wasHorizontal = axis === 'x'
  const dx = dragX.value
  tracking = false
  dragging.value = false
  axis = null

  if (wasHorizontal && Math.abs(dx) > 40) {
    if (dx > 0) goPrev()
    else goNext()
  } else {
    dragX.value = 0
  }
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  beginTrack(e.touches[0]!.clientX, e.touches[0]!.clientY)
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length !== 1) return
  moveTrack(e.touches[0]!.clientX, e.touches[0]!.clientY, e)
}

function onTouchEnd() {
  endTrack()
}

function onPointerDown(e: PointerEvent) {
  // Touch is handled via touch* listeners (non-passive)
  if (e.pointerType === 'touch') return
  if (e.button !== 0) return
  beginTrack(e.clientX, e.clientY)
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  moveTrack(e.clientX, e.clientY, e)
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  endTrack()
}

function bindStageListeners(el: HTMLElement) {
  el.addEventListener('touchstart', onTouchStart, { passive: true })
  el.addEventListener('touchmove', onTouchMove, { passive: false })
  el.addEventListener('touchend', onTouchEnd)
  el.addEventListener('touchcancel', onTouchEnd)
}

function unbindStageListeners(el: HTMLElement) {
  el.removeEventListener('touchstart', onTouchStart)
  el.removeEventListener('touchmove', onTouchMove)
  el.removeEventListener('touchend', onTouchEnd)
  el.removeEventListener('touchcancel', onTouchEnd)
}

watch(lightboxOpen, open => {
  if (open) document.addEventListener('keydown', onLightboxKey)
  else document.removeEventListener('keydown', onLightboxKey)
})

watch(stageEl, (el, prev) => {
  if (prev) unbindStageListeners(prev)
  if (el) bindStageListeners(el)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onLightboxKey)
  if (stageEl.value) unbindStageListeners(stageEl.value)
})
</script>

<template>
  <section class="bg-canvas">
    <div class="g-container g-section">
      <div class="mb-5 max-w-2xl md:mb-6 lg:mb-8">
        <p class="g-label">Документы</p>
        <h2 class="g-h g-h2">
          Сертификаты и
          <b>благодарственные</b> письма
        </h2>
      </div>

      <SnapSwiper
        force-carousel
        :items="items"
        label="Сертификаты и благодарности"
        slide-class="w-[8.5rem] sm:w-[9.5rem] md:w-[10.5rem] lg:w-[11.5rem]"
        :item-key="item => item.id"
      >
        <template #default="{ item, index }">
          <button
            type="button"
            class="g-card block w-full overflow-hidden p-1.5 text-left shadow-hard transition-transform active:translate-y-px"
            :aria-label="`Открыть документ ${item.id}`"
            @click="openLightbox(index)"
          >
            <img
              :src="item.src"
              alt=""
              class="aspect-[3/4] w-full object-contain bg-canvas"
              loading="lazy"
              decoding="async"
            />
          </button>
        </template>
      </SnapSwiper>
    </div>

    <Teleport to="body">
      <div
        v-if="activeItem"
        class="fixed inset-0 z-[100] flex flex-col bg-black/80"
        @click.self="closeLightbox"
      >
        <div
          class="flex shrink-0 items-center justify-end px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6"
        >
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Закрыть"
            @click="closeLightbox"
          >
            <Icon name="lucide:x" class="size-6" />
          </button>
        </div>

        <div
          ref="stageEl"
          class="relative flex min-h-0 flex-1 cursor-grab items-center justify-center px-4 select-none active:cursor-grabbing"
          style="touch-action: none"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @click.self="closeLightbox"
        >
          <img
            :src="activeItem.src"
            alt=""
            class="pointer-events-none max-h-full max-w-full object-contain"
            :class="dragging ? 'transition-none' : 'transition-transform duration-200 ease-out'"
            :style="{ transform: `translateX(${dragX}px)` }"
            draggable="false"
          />
        </div>

        <div class="shrink-0 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:px-6">
          <p class="mb-3 text-center text-xs font-medium tracking-wide text-white/45 md:hidden">
            Листайте в стороны
          </p>
          <div class="mx-auto flex max-w-xs items-center justify-between gap-4">
            <button
              type="button"
              class="inline-flex size-12 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15"
              aria-label="Предыдущий документ"
              @click="goPrev"
            >
              <Icon name="lucide:chevron-left" class="size-7" />
            </button>

            <p class="min-w-[4.5rem] text-center text-sm font-bold tabular-nums text-white/70">
              {{ (activeIndex ?? 0) + 1 }}
              <span class="font-medium text-white/35">/</span>
              {{ items.length }}
            </p>

            <button
              type="button"
              class="inline-flex size-12 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15"
              aria-label="Следующий документ"
              @click="goNext"
            >
              <Icon name="lucide:chevron-right" class="size-7" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
