<script setup lang="ts">
import { brand, locations, social } from '~/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-white/10 bg-ink text-white">
    <div class="g-container grid gap-10 py-14 sm:grid-cols-2 md:py-16 lg:grid-cols-4">
      <div>
        <p class="g-kicker flex h-8 items-end text-yellow">{{ brand.name }}</p>
        <p class="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
          Автотехцентр и магазин автозапчастей в г. Волгодонск
        </p>
      </div>

      <LocationCard v-for="loc in locations" :key="loc.id" :location="loc" variant="footer" />

      <div>
        <p class="g-kicker flex h-8 items-end text-yellow">Связь</p>
        <div class="mt-4 flex flex-col items-start gap-1.5 text-sm text-white/80">
          <span>{{ brand.email }}</span>
          <a
            v-for="item in social"
            :key="item.href"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            class="underline underline-offset-2"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div
        class="g-container flex flex-wrap items-center gap-x-4 gap-y-2 py-4 pr-24 text-sm text-white/80 lg:pr-6"
      >
        <p>© {{ year }} {{ brand.legalName }}</p>
        <NuxtLink to="/privacy" class="underline underline-offset-2">
          Политика ПДн
        </NuxtLink>
        <LegalRequisites variant="compact" />
        <p>
          Сведения, размещённые на сайте, носят информационный характер и не являются публичной
          офертой (ст. 437 ГК РФ).
        </p>
      </div>
    </div>
  </footer>
</template>
