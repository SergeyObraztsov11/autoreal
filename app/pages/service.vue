<script setup lang="ts">
import { brand, hours, phones, getLocation } from '~/data/site'
import { divisionLabels, servicesByDivision } from '~/data/services'

const items = servicesByDivision('service')
const location = getLocation('service')

useSeoMeta({
  title: `${divisionLabels.service} — ${brand.name}`,
  description: 'Ремонт, диагностика, ТО, установка оборудования в Волгодонске',
})
</script>

<template>
  <div>
    <PageHero label="Автотехцентр">
      <template #title>
        Услуги <b>автотехцентра</b> —<br class="hidden md:block" />
        от ТО до замены масла в АКПП
      </template>
      <template #lead>
        Слесарные работы, диагностика, сигнализации, шумоизоляция.
        {{ hours.weekdays }} · {{ hours.weekend }}.
      </template>
      <template #actions>
        <CallbackButton />
        <PhoneLink :number="phones.service" class="text-sm font-bold max-lg:hidden" />
        <div class="lg:hidden">
          <CallButton :number="phones.service" />
        </div>
      </template>
    </PageHero>

    <div class="g-container py-14 md:py-20">
      <LocationMapSection :location="location" />
    </div>

    <div class="g-container pb-14 md:pb-24">
      <ServiceCatalog :items="items" :phone="phones.service" cta-label="Запись" />
    </div>

    <HomeCta />
  </div>
</template>
