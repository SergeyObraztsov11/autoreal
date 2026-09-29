<script setup lang="ts">
import { vkGroup } from '~/data/site'
</script>

<template>
  <!--
    Mobile: one card — VK link / info / widget.
    Desktop: two separate cards.
  -->
  <section class="bg-canvas">
    <div class="g-container g-section">
      <div class="mb-5 max-w-2xl md:mb-6 lg:mb-8">
        <p class="g-label">Сообщество</p>
        <h2 class="g-h g-h2">
          Мы во <b>ВКонтакте</b>
        </h2>
      </div>

      <!-- Mobile -->
      <div
        class="overflow-hidden rounded-[var(--g-radius)] border-2 border-ink bg-white shadow-hard lg:hidden"
      >
        <div class="px-4 py-3">
          <a
            :href="vkGroup.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-sm font-bold leading-none text-ink underline-offset-2 hover:underline"
          >
            <Icon name="simple-icons:vk" class="size-[18px] shrink-0" />
            <span>ВКонтакте</span>
          </a>
        </div>

        <div class="border-t-2 border-line px-5 py-5">
          <p class="text-[13px] leading-relaxed text-muted">
            Новости, акции, отзывы и примеры работ — в официальном сообществе «Автореал».
          </p>
        </div>

        <div class="bg-canvas">
          <ClientOnly>
            <VkGroupWidget />
            <template #fallback>
              <div class="flex min-h-[400px] items-center justify-center text-sm text-muted">
                Загрузка сообщества…
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Desktop -->
      <div class="hidden lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div
          class="self-start rounded-[var(--g-radius)] border-2 border-ink bg-white p-7 shadow-hard"
        >
          <div class="flex items-center gap-4">
            <span class="g-tile h-12 w-12 shrink-0">
              <Icon name="lucide:megaphone" class="size-5" />
            </span>
            <div>
              <p class="g-kicker">
                Официальное сообщество
              </p>
              <p class="g-display mt-0.5 text-2xl font-bold">
                «Автореал» во ВКонтакте
              </p>
            </div>
          </div>

          <p class="mt-5 text-sm leading-relaxed text-muted">
            Новости автотехцентра и магазина, действующие акции, отзывы клиентов и примеры
            выполненных работ.
          </p>
        </div>

        <div
          class="flex flex-col overflow-hidden rounded-[var(--g-radius)] border-2 border-ink bg-white shadow-hard"
        >
          <div class="border-b-2 border-ink px-5 py-3 text-sm">
            <a
              :href="vkGroup.href"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-sm font-bold leading-none text-ink underline-offset-2 hover:underline"
            >
              <Icon name="simple-icons:vk" class="size-[18px] shrink-0" />
              <span>ВКонтакте</span>
            </a>
          </div>

          <div class="bg-canvas">
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
      </div>
    </div>
  </section>
</template>
