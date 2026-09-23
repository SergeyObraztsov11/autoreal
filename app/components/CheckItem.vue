<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'boxed' | 'plain'
  }>(),
  { variant: 'default' },
)

const rootClass = computed(() => {
  if (props.variant === 'boxed') {
    return 'g-hard-sm flex items-center gap-3 border-2 border-ink bg-white px-4 py-3.5 text-sm font-semibold md:py-3'
  }
  if (props.variant === 'plain') {
    return 'flex items-center gap-3 text-[15px] font-semibold md:text-sm'
  }
  return 'flex items-start gap-3 py-2 text-sm font-medium leading-snug md:text-[0.95rem]'
})
</script>

<template>
  <li :class="rootClass">
    <span
      v-if="variant === 'boxed'"
      class="g-tile g-tile-yellow h-6 w-6 shrink-0"
      aria-hidden="true"
    >
      <Icon name="lucide:check" class="size-3.5" />
    </span>
    <Icon
      v-else-if="variant === 'plain'"
      name="lucide:check"
      class="size-4 shrink-0"
      aria-hidden="true"
    />
    <span v-else class="g-tile g-tile-yellow mt-0.5 h-5 w-5 shrink-0" aria-hidden="true">
      <Icon name="lucide:check" class="size-3" />
    </span>
    <span><slot /></span>
  </li>
</template>
