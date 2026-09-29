<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'dark'
    type?: 'button' | 'submit'
    to?: string
    href?: string
    target?: string
    rel?: string
  }>(),
  {
    variant: 'primary',
    type: 'button',
    to: undefined,
    href: undefined,
    target: undefined,
    rel: undefined,
  },
)

defineEmits<{ click: [MouseEvent] }>()

const attrs = useAttrs()

const extraClass = computed(() => attrs.class)
const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const variantClass = computed(() => ({
  'g-btn-primary': props.variant === 'primary',
  'g-btn-ghost': props.variant === 'ghost',
  'g-btn-dark': props.variant === 'dark',
}))

const linkRel = computed(
  () => props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined),
)
</script>

<template>
  <NuxtLink v-if="to" v-bind="restAttrs" :to="to" class="g-btn" :class="[variantClass, extraClass]">
    <slot />
  </NuxtLink>
  <a
    v-else-if="href"
    v-bind="restAttrs"
    :href="href"
    :target="target"
    :rel="linkRel"
    class="g-btn"
    :class="[variantClass, extraClass]"
  >
    <slot />
  </a>
  <button
    v-else
    v-bind="restAttrs"
    :type="type"
    class="g-btn"
    :class="[variantClass, extraClass]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
