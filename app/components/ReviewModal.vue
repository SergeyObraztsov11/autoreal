<script setup lang="ts">
const { open, hide } = useReviewModal()
useScrollLock(open)

const name = ref('')
const rating = ref(5)
const text = ref('')
const website = ref('') // honeypot
const sent = ref(false)
const submitting = ref(false)
const error = ref('')
const fieldErrors = ref<Partial<Record<'name' | 'rating' | 'text', string>>>({})

const panel = ref<HTMLElement>()
const nameInput = ref<HTMLInputElement>()
let opener: HTMLElement | null = null

const TEXT_MIN = 20
const TEXT_MAX = 1200

function clearErrors() {
  error.value = ''
  fieldErrors.value = {}
}

function clearFieldError(field: 'name' | 'rating' | 'text') {
  if (!fieldErrors.value[field]) return
  fieldErrors.value = {
    ...fieldErrors.value,
    [field]: undefined,
  }
}

function validateClient(): boolean {
  const next: Partial<Record<'name' | 'rating' | 'text', string>> = {}
  const trimmedName = name.value.trim()
  const trimmedText = text.value.trim()

  if (!trimmedName || trimmedName.length < 2) {
    next.name = 'Укажите корректное имя'
  }
  if (!Number.isInteger(rating.value) || rating.value < 1 || rating.value > 5) {
    next.rating = 'Выберите оценку от 1 до 5'
  }
  if (!trimmedText || trimmedText.length < TEXT_MIN) {
    next.text = `Напишите отзыв — минимум ${TEXT_MIN} символов`
  }
  else if (trimmedText.length > TEXT_MAX) {
    next.text = `Отзыв слишком длинный — максимум ${TEXT_MAX} символов`
  }

  fieldErrors.value = next
  return Object.keys(next).length === 0
}

async function onSubmit() {
  if (submitting.value) return
  clearErrors()
  if (!validateClient()) return

  submitting.value = true
  try {
    await $fetch('/api/review', {
      method: 'POST',
      body: {
        name: name.value.trim(),
        rating: rating.value,
        text: text.value.trim(),
        website: website.value,
      },
    })
    sent.value = true
  }
  catch (err) {
    const parsed = parseApiError(err)
    fieldErrors.value = {
      name: parsed.fieldErrors.name,
      rating: parsed.fieldErrors.rating,
      text: parsed.fieldErrors.text,
    }
    error.value = bannerMessageForApiError(parsed)
  }
  finally {
    submitting.value = false
  }
}

function onPrivacyClick() {
  hide()
}

function focusables() {
  return [
    ...(panel.value?.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
    ) ?? []),
  ].filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    hide()
    return
  }
  if (e.key !== 'Tab') return
  const list = focusables()
  if (!list.length) return
  const first = list[0]!
  const last = list[list.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  }
  else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(open, async (v) => {
  if (v) {
    opener = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    nameInput.value?.focus()
  }
  else {
    document.removeEventListener('keydown', onKeydown)
    sent.value = false
    submitting.value = false
    clearErrors()
    name.value = ''
    rating.value = 5
    text.value = ''
    website.value = ''
    opener?.focus()
    opener = null
  }
})

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      @click.self="hide"
    >
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        class="g-card w-full p-5 max-sm:max-h-[calc(100dvh-3rem)] max-sm:overflow-y-auto max-sm:border-x-0 max-sm:border-b-0 max-sm:border-t-4 max-sm:border-t-yellow max-sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-sm:shadow-none sm:max-w-md sm:p-6 md:p-7"
      >
        <div class="mb-5 flex items-start justify-between gap-4 sm:mb-6">
          <div>
            <h2 id="review-modal-title" class="g-display text-xl font-bold sm:text-2xl">
              Написать отзыв
            </h2>
            <p class="mt-1 text-sm text-muted">
              Нам важно ваше мнение о сервисе и магазине
            </p>
          </div>
          <button
            type="button"
            class="inline-flex size-10 shrink-0 items-center justify-center text-ink transition-opacity hover:opacity-60 sm:size-9"
            aria-label="Закрыть"
            @click="hide"
          >
            <Icon name="lucide:x" class="size-5" />
          </button>
        </div>

        <form v-if="!sent" class="relative space-y-4" @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-1.5 block text-sm font-semibold">Имя</span>
            <input
              ref="nameInput"
              v-model="name"
              required
              type="text"
              autocomplete="name"
              maxlength="60"
              class="g-input"
              :class="fieldErrors.name ? 'border-red-600' : ''"
              placeholder="Как вас представить"
              @input="clearFieldError('name')"
            >
            <p v-if="fieldErrors.name" class="mt-1.5 text-sm text-red-600">
              {{ fieldErrors.name }}
            </p>
          </label>

          <fieldset>
            <legend class="mb-1.5 block text-sm font-semibold">
              Оценка
            </legend>
            <div
              class="flex items-center gap-1"
              :aria-label="`Оценка ${rating} из 5`"
            >
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                class="rounded p-1 transition-transform hover:scale-110"
                :aria-label="`${n} из 5`"
                :aria-pressed="rating === n"
                @click="rating = n; clearFieldError('rating')"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="size-8"
                  :class="n <= rating ? 'text-yellow' : 'text-ink/15'"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    stroke="var(--g-ink)"
                    stroke-width="0.9"
                    stroke-linejoin="round"
                    d="M12 2.5l2.9 6.1 6.7.7-5 4.6 1.4 6.6L12 17.3 5.9 20.5l1.4-6.6-5-4.6 6.7-.7L12 2.5z"
                  />
                </svg>
              </button>
            </div>
            <p v-if="fieldErrors.rating" class="mt-1.5 text-sm text-red-600">
              {{ fieldErrors.rating }}
            </p>
          </fieldset>

          <label class="block">
            <span class="mb-1.5 block text-sm font-semibold">Отзыв</span>
            <textarea
              v-model="text"
              required
              rows="5"
              :maxlength="TEXT_MAX"
              class="g-input min-h-[8rem] resize-y"
              :class="fieldErrors.text ? 'border-red-600' : ''"
              placeholder="Что понравилось, как прошёл визит…"
              @input="clearFieldError('text')"
            />
            <div class="mt-1.5 flex items-start justify-between gap-3">
              <p v-if="fieldErrors.text" class="text-sm text-red-600">
                {{ fieldErrors.text }}
              </p>
              <p class="ml-auto text-xs text-muted">
                {{ text.trim().length }}/{{ TEXT_MAX }}
              </p>
            </div>
          </label>

          <div class="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>
              Сайт
              <input
                v-model="website"
                type="text"
                name="website"
                tabindex="-1"
                autocomplete="off"
              >
            </label>
          </div>

          <p class="text-xs text-muted">
            Нажимая кнопку, вы даёте согласие на
            <NuxtLink
              to="/privacy"
              class="font-semibold underline decoration-yellow decoration-[3px] underline-offset-[4px]"
              @click="onPrivacyClick"
            >
              обработку персональных данных
            </NuxtLink>
          </p>
          <p v-if="error" class="text-sm text-red-600">
            {{ error }}
          </p>
          <AppButton type="submit" class="w-full" :disabled="submitting">
            <Icon name="lucide:upload" class="size-4" />
            {{ submitting ? 'Отправка…' : 'Отправить отзыв' }}
          </AppButton>
        </form>

        <div v-else class="py-2">
          <p class="g-display text-xl font-bold">
            Спасибо за отзыв
          </p>
          <p class="mt-2 text-sm text-muted">
            Спасибо — для нас важно слышать клиентов.
          </p>
          <AppButton class="mt-6 w-full sm:w-auto" variant="ghost" @click="hide">
            <Icon name="lucide:check" class="size-4" />
            Закрыть
          </AppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
