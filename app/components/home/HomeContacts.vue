<script setup lang="ts">
import { media } from '~/data/media'
import { locations } from '~/data/site'
</script>

<template>
  <section id="contacts" class="relative scroll-mt-20 overflow-hidden bg-white">
    <SectionSplit aside>
      <p class="g-label">Контакты</p>
      <h2 class="g-h g-h2">Сервис и магазин в <b>Волгодонске</b></h2>

      <template #media>
        <SectionPhoto :src="media.home.garage" aspect="aspect-[4/3]" badge="Два адреса" />
      </template>

      <template #body>
        <ul class="space-y-4">
          <LocationCard v-for="loc in locations" :key="loc.id" :location="loc" variant="home" />
        </ul>

        <NavButton to="/about" variant="ghost" class="mt-8 w-full md:w-auto">
          Адреса и карта
        </NavButton>
      </template>
    </SectionSplit>
  </section>
</template>
