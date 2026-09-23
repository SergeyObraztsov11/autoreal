<script setup lang="ts">
import type { NuxtError } from '#app'
import { brand } from '~/data/site'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => Number(props.error?.statusCode) || 500)

const requestId = computed(() => {
  const data = props.error?.data
  if (data && typeof data === 'object' && 'requestId' in data) {
    const id = (data as { requestId?: unknown }).requestId
    if (typeof id === 'string' && id) return id
  }
  if (import.meta.server) {
    return useRequestEvent()?.context.requestId ?? null
  }
  return null
})


if (statusCode.value === 404) {
  clearError()
  await navigateTo('/', { replace: true })
}

const title = 'Что-то пошло не так'
const lead = 'На сервере случился сбой. Попробуйте обновить страницу или вернуться на главную.'

useSeoMeta({
  title: `${title} — ${brand.name}`,
})

function goHome() {
  clearError()
  navigateTo('/')
}
</script>

<template>
  <div
    v-if="statusCode !== 404"
    class="flex min-h-dvh items-center justify-center bg-canvas px-4 py-16 text-ink"
  >
    <article class="g-card w-full max-w-lg border-t-4 border-t-yellow p-8 md:p-10">
      <p class="mb-5 text-2xl font-bold uppercase tracking-[0.2em] text-red-600">
        Ошибка {{ statusCode }}
      </p>
      <h1 class="g-display text-3xl font-bold md:text-4xl">
        {{ title }}
      </h1>
      <p class="mt-4 text-base leading-relaxed text-muted md:text-base">
        {{ lead }}
      </p>
      <p v-if="requestId" class="mt-6 font-mono text-xs text-muted">
        Код обращения:
        <span class="select-all">{{ requestId }}</span>
      </p>
      <AppButton type="button" class="mt-8 w-full sm:w-auto" @click="goHome">
        На главную
        <Icon name="lucide:arrow-right" class="size-4" />
      </AppButton>
    </article>
  </div>
</template>
