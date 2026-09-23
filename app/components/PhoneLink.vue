<script setup lang="ts">
import { formatPhoneDisplay, phoneTelHref } from '~/utils/phone'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    number: string
    /** false — обычное подчёркивание на мобиле, без жёлтого акцента */
    accent?: boolean
  }>(),
  { accent: true },
)

const attrs = useAttrs()

const display = computed(() => formatPhoneDisplay(props.number))
const href = computed(() => phoneTelHref(props.number))

const mobileClass = computed(() => [
  attrs.class,
  props.accent ? 'g-link-accent' : 'underline-offset-2 hover:underline',
])
</script>

<template>
  <!-- Mobile / tablet: tappable tel link -->
  <a
    :href="href"
    class="phone lg:hidden"
    :class="mobileClass"
  >
    {{ display }}
  </a>
  <!-- Desktop: plain text, not a link -->
  <span
    class="phone hidden lg:inline"
    :class="attrs.class"
  >
    {{ display }}
  </span>
</template>
