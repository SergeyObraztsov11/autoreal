<script setup lang="ts">
import type { Location } from '~/data/site'
import { yandexRouteUrl } from '~/data/site'

/** Yandex route CTA — always «Маршрут» + navigation icon. */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    location: Location
    variant?: 'primary' | 'ghost' | 'dark'
  }>(),
  { variant: 'ghost' },
)

const attrs = useAttrs()
</script>

<template>
  <AppButton
    v-bind="attrs"
    :href="yandexRouteUrl(props.location)"
    :variant="variant"
    target="_blank"
  >
    <Icon name="lucide:navigation" class="size-4" />
    Маршрут
  </AppButton>
</template>
