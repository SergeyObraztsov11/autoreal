<script setup lang="ts">
/** Mobile/desktop call CTA — always «Позвонить» + phone icon. */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    number: string
    variant?: 'primary' | 'ghost' | 'dark'
  }>(),
  { variant: 'ghost' },
)

const attrs = useAttrs()
</script>

<template>
  <AppButton
    v-bind="attrs"
    :href="phoneTelHref(props.number)"
    :variant="variant"
  >
    <Icon name="lucide:phone" class="size-4" />
    Позвонить
  </AppButton>
</template>
