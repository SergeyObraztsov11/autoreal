<script setup lang="ts">
const { open, title, hide } = useRequestModal()
useScrollLock(open)

const name = ref('')
const phone = ref('')
const website = ref('') // honeypot
const sent = ref(false)
const submitting = ref(false)
const error = ref('')
const fieldErrors = ref<Partial<Record<'name' | 'phone', string>>>({})

const panel = ref<HTMLElement>()
const nameInput = ref<HTMLInputElement>()
let opener: HTMLElement | null = null

function clearErrors() {
  error.value = ''
  fieldErrors.value = {}
}

function onPhoneInput(e: Event) {
  const el = e.target as HTMLInputElement
  phone.value = maskPhoneInput(el.value)
  el.value = phone.value
  clearFieldError('phone')
}

function clearFieldError(field: 'name' | 'phone') {
  if (!fieldErrors.value[field]) return
  fieldErrors.value = {
    name: field === 'name' ? undefined : fieldErrors.value.name,
    phone: field === 'phone' ? undefined : fieldErrors.value.phone,
  }
}

function validateClient(): boolean {
  const next: Partial<Record<'name' | 'phone', string>> = {}
  const trimmedName = name.value.trim()

  if (!trimmedName || trimmedName.length < 2) {
    next.name = 'Укажите корректное имя'
  }
  if (!isValidRuPhone(phone.value)) {
    next.phone = phone.value.trim()
      ? 'Введите номер полностью: +7 (XXX) XXX-XX-XX'
      : 'Укажите телефон'
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
    await $fetch('/api/request', {
      method: 'POST',
      body: {
        name: name.value.trim(),
        phone: phone.value,
        title: title.value,
        website: website.value,
      },
    })
    sent.value = true
  } catch (err) {
    const parsed = parseApiError(err)
    fieldErrors.value = parsed.fieldErrors
    error.value = bannerMessageForApiError(parsed)
  } finally {
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
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(open, async v => {
  if (v) {
    opener = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    nameInput.value?.focus()
  } else {
    document.removeEventListener('keydown', onKeydown)
    sent.value = false
    submitting.value = false
    clearErrors()
    name.value = ''
    phone.value = ''
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
      <!-- mobile: bottom sheet; desktop: centered card -->
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
        class="g-card w-full p-5 max-sm:max-h-[calc(100dvh-3rem)] max-sm:overflow-y-auto max-sm:border-x-0 max-sm:border-b-0 max-sm:border-t-4 max-sm:border-t-yellow max-sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-sm:shadow-none sm:max-w-md sm:p-6 md:p-7"
      >
        <div class="mb-5 flex items-start justify-between gap-4 sm:mb-6">
          <div>
            <h2 id="request-modal-title" class="g-display text-xl font-bold sm:text-2xl">
              {{ title }}
            </h2>
            <p class="mt-1 text-sm text-muted">Специалист свяжется с вами в течение 15 минут</p>
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
              placeholder="Как к вам обращаться"
              @input="clearFieldError('name')"
            />
            <p v-if="fieldErrors.name" class="mt-1.5 text-sm text-red-600">
              {{ fieldErrors.name }}
            </p>
          </label>
          <label class="block">
            <span class="mb-1.5 block text-sm font-semibold">Телефон</span>
            <input
              :value="phone"
              required
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              :minlength="PHONE_MASK_LENGTH"
              :maxlength="PHONE_MASK_LENGTH"
              class="g-input phone"
              :class="fieldErrors.phone ? 'border-red-600' : ''"
              placeholder="+7 (___) ___-__-__"
              @input="onPhoneInput"
            />
            <p v-if="fieldErrors.phone" class="mt-1.5 text-sm text-red-600">
              {{ fieldErrors.phone }}
            </p>
          </label>

          <!-- Honeypot: hidden from users, bots often fill it -->
          <div class="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>
              Сайт
              <input
                v-model="website"
                type="text"
                name="website"
                tabindex="-1"
                autocomplete="off"
              />
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
            {{ submitting ? 'Отправка…' : 'Отправить заявку' }}
          </AppButton>
        </form>

        <div v-else class="py-2">
          <p class="g-display text-xl font-bold">Заявка принята</p>
          <p class="mt-2 text-sm text-muted">Мы скоро перезвоним.</p>
          <AppButton class="mt-6 w-full sm:w-auto" variant="ghost" @click="hide">
            <Icon name="lucide:check" class="size-4" />
            Закрыть
          </AppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
