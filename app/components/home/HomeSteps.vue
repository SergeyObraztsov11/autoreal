<script setup lang="ts">
const steps = [
  {
    icon: 'lucide:phone',
    title: 'Заявка',
    text: 'Звоните или оставляете номер — подберём время на диагностику или ремонт.',
  },
  {
    icon: 'lucide:map-pin',
    title: 'Визит',
    text: 'Приезжаете на сервис. Мастера осматривают авто и согласуют объём работ.',
  },
  {
    icon: 'lucide:wrench',
    title: 'Ремонт',
    text: 'Работаем по заказ-наряду. Запчасти — со своего склада.',
  },
  {
    icon: 'lucide:key-round',
    title: 'Выдача',
    text: 'Показываем результат и передаём ключи.',
  },
]
</script>

<template>
  <section class="relative overflow-hidden bg-white">
    <div class="g-container g-section">
      <div class="mb-6 max-w-2xl md:mb-8 lg:mb-10">
        <p class="g-label">Запись</p>
        <h2 class="g-h g-h2">Как мы работаем — <b>четыре шага</b></h2>
      </div>

      <!-- Mobile: vertical timeline -->
      <ol class="relative space-y-0 lg:hidden">
        <li
          v-for="(step, i) in steps"
          :key="step.title"
          class="relative flex gap-4 pb-8 last:pb-0"
        >
          <div class="relative flex flex-col items-center">
            <span
              class="g-tile g-tile-yellow relative z-10 h-12 w-12 shrink-0 text-sm font-bold"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <span
              v-if="i < steps.length - 1"
              class="absolute top-12 bottom-0 w-0.5 bg-ink"
              aria-hidden="true"
            />
          </div>

          <div class="min-w-0 flex-1 pt-1">
            <div class="flex items-center gap-2.5">
              <Icon :name="step.icon" class="size-4 shrink-0 text-ink" aria-hidden="true" />
              <h3 class="g-display text-xl font-bold leading-none text-ink">
                {{ step.title }}
              </h3>
            </div>
            <p class="mt-2.5 text-[0.95rem] leading-relaxed text-ink/90">
              {{ step.text }}
            </p>
          </div>
        </li>
      </ol>

      <!-- Desktop: connected row -->
      <ol class="hidden lg:grid lg:grid-cols-4 lg:gap-5">
        <li
          v-for="(step, i) in steps"
          :key="step.title"
          class="relative flex flex-col"
        >
          <div class="flex items-center gap-3">
            <span
              class="g-tile g-tile-yellow h-14 w-14 shrink-0 text-base font-bold"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <span
              v-if="i < steps.length - 1"
              class="h-0.5 flex-1 bg-ink"
              aria-hidden="true"
            />
            <span
              v-else
              class="h-0.5 flex-1 bg-transparent"
              aria-hidden="true"
            />
          </div>

          <div
            class="mt-5 flex flex-1 flex-col border-2 border-ink bg-canvas px-5 py-5 g-radius"
          >
            <div class="flex items-center gap-2.5">
              <span class="g-tile h-9 w-9 shrink-0">
                <Icon :name="step.icon" class="size-4" />
              </span>
              <h3 class="g-display text-[1.35rem] font-bold leading-none text-ink">
                {{ step.title }}
              </h3>
            </div>
            <p class="mt-3 text-[0.95rem] leading-relaxed text-ink/90">
              {{ step.text }}
            </p>
          </div>
        </li>
      </ol>

      <div class="mt-8 md:mt-10">
        <CallbackButton class="w-full sm:w-auto" />
      </div>
    </div>
  </section>
</template>
