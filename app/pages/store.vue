<script setup lang="ts">
import { brand, hours, phones, getLocation } from '~/data/site'
import { divisionLabels, servicesByDivision } from '~/data/services'

const items = servicesByDivision('store')
const location = getLocation('store')

useSeoMeta({
  title: `${divisionLabels.store} — ${brand.name}`,
  description: 'Автозапчасти, масла, фильтры, автоэлектроника. Заказ и доставка в Волгодонске',
})
</script>

<template>
  <div>
    <PageHero label="Магазин">
      <template #title>
        Запчасти <b>в наличии</b><br class="hidden md:block" />
        и под заказ <b>с доставкой</b>.
      </template>
      <template #lead>
        Подбор по марке и VIN. Установку охранных систем и замену жидкостей выполняем в техцентре.
        {{ hours.weekdays }} · {{ hours.weekend }}.
      </template>
      <template #actions>
        <CallbackButton />
        <PhoneLink
          :number="phones.storeTollFree"
          class="text-sm font-bold max-lg:hidden"
        />
        <div class="lg:hidden">
          <CallButton :number="phones.storeTollFree" />
        </div>
      </template>
    </PageHero>

    <div class="g-container py-12 md:py-20">
      <LocationMapSection :location="location" />
    </div>

    <div class="g-container pb-12 md:pb-20">
      <ServiceCatalog :items="items" :phone="phones.storeTollFree" cta-label="Заказ" />
    </div>

    <HomeCta />
  </div>
</template>
