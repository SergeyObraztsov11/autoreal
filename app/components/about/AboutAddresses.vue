<script setup lang="ts">
import { locations } from '~/data/site'
</script>

<template>
  <section class="bg-white">
    <div class="g-container g-section">
      <div class="mb-5 max-w-2xl md:mb-6 lg:mb-8">
        <p class="g-label">Адреса</p>
        <h2 class="g-h g-h2">Сервис и магазин в <b>Волгодонске</b></h2>
      </div>

      <div class="space-y-8 md:space-y-10 lg:space-y-12">
        <LocationMapSection v-for="loc in locations" :key="loc.id" :location="loc" />
      </div>
    </div>
  </section>
</template>
