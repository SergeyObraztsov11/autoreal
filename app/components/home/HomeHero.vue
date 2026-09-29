<script setup lang="ts">
import { phones, getLocation } from '~/data/site'
import { media } from '~/data/media'

const location = getLocation('service')
</script>

<template>
  <section class="relative overflow-hidden bg-white">
    <SectionSplit aside>
      <p class="g-label">Автотехцентр · Волгодонск · {{ location.address }}</p>

      <h1 class="g-h g-h1">
        Полный цикл обслуживания
        <span class="mt-1 block md:mt-2">автомобиля — <b>в одном месте</b></span>
      </h1>

      <p class="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink md:mt-6 md:text-lg">
        ТО, ремонт и запчасти со своего склада.
        <NuxtLink
          to="/service#complex-diagnostics"
          class="font-bold underline decoration-yellow decoration-[3px] underline-offset-[5px]"
        >
          Комплексная диагностика бесплатно
        </NuxtLink>
        при последующем ремонте.
      </p>

      <template #media>
        <SectionPhoto
          :src="media.home.hero"
          aspect="aspect-[4/3] lg:aspect-[4/5]"
          badge="Автотехцентр"
          priority
        />
      </template>

      <template #body>
        <div class="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
          <CallbackButton class="w-full sm:w-auto" />
          <div class="md:hidden">
            <CallButton :number="phones.service" variant="ghost" class="w-full" />
          </div>
          <div class="hidden sm:block">
            <NavButton to="/service" variant="ghost">Все услуги</NavButton>
          </div>
        </div>
      </template>
    </SectionSplit>
  </section>
</template>
