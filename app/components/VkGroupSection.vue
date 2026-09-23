<script setup lang="ts">
import { vkGroup } from '~/data/site'
</script>

<template>
  <!--
    Same shell as LocationMapSection:
    Mobile — one outline (info without bottom border + widget card).
    Desktop — two separate cards; section itself has no border/shadow.
  -->
  <section class="lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
    <div
      class="border-2 border-b-0 border-ink bg-white px-4 py-4 lg:self-start lg:border-b-2 lg:p-7 lg:shadow-hard"
    >
      <!-- Mobile: short block -->
      <div class="lg:hidden">
        <p class="text-xs font-bold uppercase tracking-[0.14em] text-muted">
          Сообщество
        </p>
        <p class="mt-2 text-lg font-bold leading-snug">
          «Автореал» во ВКонтакте
        </p>
        <p class="mt-3 text-[13px] leading-relaxed text-muted">
          Новости, акции, отзывы и примеры работ.
        </p>
      </div>

      <!-- Desktop: full card content -->
      <div class="hidden lg:block">
        <div class="flex items-center gap-4">
          <span class="g-tile h-12 w-12 shrink-0">
            <Icon name="lucide:megaphone" class="size-5" />
          </span>
          <div>
            <p class="g-kicker">
              Официальное сообщество
            </p>
            <h2 class="g-display mt-0.5 text-2xl font-bold">
              «Автореал» во ВКонтакте
            </h2>
          </div>
        </div>

        <p class="mt-5 text-sm leading-relaxed text-muted">
          Новости автотехцентра и магазина, действующие акции, отзывы клиентов и примеры
          выполненных работ.
        </p>
      </div>
    </div>

    <div
      class="flex flex-col overflow-hidden border-2 border-ink bg-white shadow-hard-sm lg:shadow-hard"
    >
      <div
        class="order-2 flex items-center justify-between border-t border-line px-4 py-3 text-sm lg:order-1 lg:border-b-2 lg:border-t-0 lg:border-ink lg:px-5"
      >
        <span class="font-semibold text-ink">Группа ВКонтакте</span>
        <a
          :href="vkGroup.href"
          target="_blank"
          rel="noopener noreferrer"
          class="font-bold text-ink underline-offset-2 hover:underline lg:g-link-accent lg:underline"
        >
          Открыть в VK
        </a>
      </div>

      <div class="order-1 lg:order-2">
        <ClientOnly>
          <VkGroupWidget />
          <template #fallback>
            <div class="flex min-h-[600px] items-center justify-center text-sm text-muted">
              Загрузка сообщества…
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
