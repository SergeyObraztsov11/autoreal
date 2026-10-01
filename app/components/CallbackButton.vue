<script setup lang="ts">
/**
 * Single entry point for opening the callback request modal.
 * Always the same label + icon so CTAs stay consistent site-wide.
 */
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'dark'
  }>(),
  { variant: 'primary' },
)

const emit = defineEmits<{ click: [MouseEvent] }>()

const { show } = useRequestModal()
const attrs = useAttrs()

function onClick(e: MouseEvent) {
  show()
  emit('click', e)
}
</script>

<template>
  <AppButton v-bind="attrs" :variant="variant" @click="onClick">
    <Icon name="lucide:phone-call" class="size-4" />
    Заказать звонок
  </AppButton>
</template>
