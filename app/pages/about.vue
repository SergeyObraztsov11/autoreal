<script setup lang="ts">
import { brand, phones } from '~/data/site'

useSeoMeta({
  title: `О нас — ${brand.name}`,
  description:
    'Автотехцентр и магазин автозапчастей «Автореал» в Волгодонске: адреса, режим работы и контакты.',
})
</script>

<template>
  <div>
    <PageHero label="О компании">
      <template #title>
        <b>Автореал</b> — техцентр и магазин<br class="hidden md:block" />
        в Волгодонске
      </template>
      <template #lead>
        Ремонт, диагностика и подбор запчастей. Сервис и магазин — на разных адресах.
      </template>
      <template #actions>
        <CallbackButton />
        <PhoneLink :number="phones.service" class="text-sm font-bold max-lg:hidden" />
        <div class="lg:hidden">
          <CallButton :number="phones.service" variant="dark" />
        </div>
      </template>
    </PageHero>

    <YandexReviewsSection />
    <WriteReviewSection />
    <AboutLetters />
    <AboutAddresses />
    <VkGroupSection />
    <HomeCta />
  </div>
</template>
