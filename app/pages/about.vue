<script setup lang="ts">
import { brand, hours, locations, social } from '~/data/site'

useSeoMeta({
  title: `О нас — ${brand.name}`,
  description:
    'Автотехцентр и магазин автозапчастей «Автореал» в Волгодонске: адреса, режим работы, телефоны и схема проезда.',
})

const doing = [
  'Плановое ТО и постгарантийное обслуживание',
  'Ремонт подвески, электрики и агрегатов',
  'Аппаратная замена масла в АКПП',
  'Установка сигнализаций и шумоизоляции',
  'Подбор и продажа запчастей с доставкой',
]
</script>

<template>
  <div>
    <PageHero label="О компании">
      <template #title>
        <b>Автореал</b> — техцентр и магазин<br class="hidden md:block" />
        автозапчастей в Волгодонске.
      </template>
      <template #lead>
        Ремонт, диагностика, установка оборудования и подбор деталей — в одном цикле.
        Автотехцентр и магазин работают по разным адресам.
      </template>
    </PageHero>

    <div class="g-container grid gap-6 py-12 md:grid-cols-2 md:gap-8 md:py-20 lg:gap-14">
      <section class="g-card p-5 md:p-8">
        <h2 class="g-display text-xl font-bold md:text-2xl">Что делаем</h2>
        <ul class="mt-5">
          <CheckItem v-for="d in doing" :key="d">
            {{ d }}
          </CheckItem>
        </ul>
      </section>

      <section class="border-2 border-ink bg-yellow p-5 md:self-start md:p-8">
        <h2 class="g-display text-xl font-bold md:text-2xl">Режим работы</h2>
        <p class="mt-4 font-semibold">
          {{ hours.weekdays }}
        </p>
        <p class="mt-1 font-semibold">
          {{ hours.weekend }}
        </p>
      </section>
    </div>

    <div class="g-container space-y-12 pb-12 md:space-y-16 md:pb-20">
      <LocationMapSection
        v-for="loc in locations"
        :key="loc.id"
        :location="loc"
      />

      <VkGroupSection />

      <section class="border-t-2 border-ink pt-8">
        <LegalRequisites show-label />
        <p class="g-kicker mt-5">Электронная почта и соцсети</p>
        <nav
          aria-label="Связь и соцсети"
          class="mt-2 flex flex-col items-start gap-1.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5"
        >
          <span class="font-semibold text-ink">{{ brand.email }}</span>
          <a
            v-for="item in social"
            :key="item.href"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            class="g-link-accent font-semibold text-ink"
          >
            {{ item.label }}
          </a>
        </nav>
      </section>
    </div>

    <HomeCta />
  </div>
</template>
