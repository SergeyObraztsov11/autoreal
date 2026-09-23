<script setup lang="ts">
/**
 * Catch-all: любой неизвестный путь ведём на главную
 * (вместо экрана 404 через error.vue).
 */
await navigateTo('/', { replace: true })
</script>

<template>
  <div />
</template>
