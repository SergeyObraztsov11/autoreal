<script setup lang="ts">
/** In-app navigation CTA — label from slot, trailing arrow. */
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    to: string
    variant?: 'primary' | 'ghost' | 'dark'
  }>(),
  { variant: 'primary' },
)

const attrs = useAttrs()
</script>

<template>
  <AppButton v-bind="attrs" :to="to" :variant="variant">
    <slot />
    <Icon name="lucide:arrow-right" class="size-4" />
  </AppButton>
</template>
