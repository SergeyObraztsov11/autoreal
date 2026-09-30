<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'boxed' | 'plain'
  }>(),
  { variant: 'default' },
)

const rootClass = computed(() => {
  if (props.variant === 'boxed') {
    return 'flex items-center gap-3.5 py-1 text-[0.95rem] font-semibold leading-snug'
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
      class="g-tile g-tile-yellow h-7 w-7 shrink-0 md:h-6 md:w-6"
      aria-hidden="true"
    >
      <Icon name="lucide:check" class="size-4 md:size-3.5" />
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
