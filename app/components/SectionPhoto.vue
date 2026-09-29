<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string
    badge?: string
    /** Fixed ratio — controls height. Default 4/3 when framed. Empty = natural. */
    aspect?: string
    priority?: boolean
    /** Hard shadow + ink border. Off = plain photo. */
    framed?: boolean
    /** On ink backgrounds, use yellow extrusion so the shadow stays visible. */
    tone?: 'light' | 'dark'
  }>(),
  {
    badge: undefined,
    aspect: undefined,
    priority: false,
    framed: true,
    tone: 'light',
  },
)

const frameBorder = computed(() => (props.tone === 'dark' ? 'border-yellow' : 'border-ink'))
const frameShadow = computed(() =>
  props.tone === 'dark' ? 'shadow-hard-yellow' : 'shadow-hard',
)
</script>

<template>
  <div class="relative w-full">
    <!-- Plain / cutout photo — no border, no shadow -->
    <img
      v-if="!framed"
      :src="src"
      alt=""
      class="block w-full object-contain"
      :class="aspect || undefined"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
    />

    <!-- Framed: one hard shadow (same as cards) -->
    <div
      v-else
      class="relative overflow-hidden border-2 bg-canvas g-radius"
      :class="[frameBorder, frameShadow]"
    >
      <img
        :src="src"
        alt=""
        class="block w-full object-cover"
        :class="aspect || 'aspect-[4/3]'"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined"
      />
      <span
        v-if="badge"
        class="absolute bottom-0 left-0 bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-yellow"
      >
        {{ badge }}
      </span>
    </div>
  </div>
</template>
