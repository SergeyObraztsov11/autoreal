<script setup lang="ts">
import { brand } from '~/data/site'

useSeoMeta({
  title: `${brand.name} — автотехцентр и магазин автозапчастей в Волгодонске`,
  description: brand.tagline,
})
</script>

<template>
  <div>
    <HomeHero />
    <HomeWhy />
    <HomeServices />
    <HomeAkpp />
    <HomeStore />
    <HomeContacts />
    <HomeCta />
  </div>
</template>
