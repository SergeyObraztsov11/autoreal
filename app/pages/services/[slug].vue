<script setup lang="ts">
import { divisionPaths, getService } from '~/data/services'

const route = useRoute()
const slug = String(route.params.slug)
const service = getService(slug)

const target = service ? `${divisionPaths[service.division]}#${service.slug}` : '/service'

await navigateTo(target, { redirectCode: 301, replace: true })
</script>

<template>
  <div />
</template>
