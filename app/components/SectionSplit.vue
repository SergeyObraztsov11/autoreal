<script setup lang="ts">
/**
 * Shared photo + copy layout for home sections.
 *
 * Default (`split`):
 *   Row 1 — heading/lead + photo, vertically centered (photo from md).
 *   Row 2 — section body full width.
 *
 * `aside`:
 *   From md — left column is heading + body; photo on the right,
 *   vertically centered against the whole left stack. No photo on sm.
 */
withDefaults(
  defineProps<{
    aside?: boolean
  }>(),
  { aside: false },
)
</script>

<template>
  <div
    class="g-container g-section grid gap-x-8 gap-y-5 md:gap-x-10 lg:gap-x-16"
    :class="
      aside
        ? 'items-center md:grid-cols-[minmax(0,1fr)_minmax(13rem,18rem)] lg:grid-cols-[1.15fr_0.85fr]'
        : 'items-start md:grid-cols-[minmax(0,1fr)_minmax(13rem,18rem)] md:gap-y-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-y-8'
    "
  >
    <template v-if="aside">
      <div class="min-w-0 md:col-start-1">
        <slot />
        <div v-if="$slots.body" class="mt-6 md:mt-8">
          <slot name="body" />
        </div>
      </div>
      <div
        v-if="$slots.media"
        class="hidden min-w-0 self-center md:col-start-2 md:block"
      >
        <slot name="media" />
      </div>
    </template>

    <template v-else>
      <div class="min-w-0 self-center md:col-start-1 md:row-start-1">
        <slot />
      </div>
      <div
        v-if="$slots.media"
        class="hidden min-w-0 self-center md:col-start-2 md:row-start-1 md:block"
      >
        <slot name="media" />
      </div>
      <div
        v-if="$slots.body"
        class="min-w-0 md:col-span-2 md:row-start-2"
      >
        <slot name="body" />
      </div>
    </template>
  </div>
</template>
