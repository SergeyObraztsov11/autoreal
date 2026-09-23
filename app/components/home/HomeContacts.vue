<script setup lang="ts">
import { media } from '~/data/media'
import { locations } from '~/data/site'
</script>

<template>
  <section
    id="contacts"
    class="g-cut-top-l relative -mt-10 scroll-mt-20 overflow-hidden bg-canvas lg:mt-0"
  >
    <div
      class="relative mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-16 md:gap-14 md:px-6 md:py-28 lg:grid-cols-[1fr_1fr] lg:gap-10"
    >
      <div>
        <h2 class="g-h text-3xl leading-[1.12] md:text-5xl md:leading-[1.08] lg:text-6xl">
          Автотехцентр и магазин —
          <br class="hidden md:block" />
          <b>разные адреса</b> в Волгодонске.
        </h2>

        <ul class="mt-6 space-y-3 md:mt-10 md:space-y-5">
          <LocationCard v-for="loc in locations" :key="loc.id" :location="loc" variant="home" />
        </ul>

        <NavButton to="/about" variant="ghost" class="mt-6 w-full sm:w-auto md:mt-10">
          Открыть на карте
        </NavButton>
      </div>

      <div class="relative hidden aspect-[4/5] lg:block lg:aspect-auto">
        <div
          class="g-para-r absolute inset-y-0 right-0 w-[80%] translate-x-3 translate-y-3 bg-ink"
          aria-hidden="true"
        />
        <div class="g-para-r absolute inset-y-0 right-0 w-[80%] bg-yellow" aria-hidden="true" />
        <img
          :src="media.home.garage"
          alt=""
          class="g-para-l absolute inset-y-[6%] left-0 h-[88%] w-[90%] bg-canvas object-cover object-[44%_50%]"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>
