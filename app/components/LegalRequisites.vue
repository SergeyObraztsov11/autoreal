<script setup lang="ts">
import { brand, legal } from '~/data/site'

withDefaults(
  defineProps<{
    /** full — имя, адрес, все номера; compact — только ОГРН/ИНН/КПП */
    variant?: 'full' | 'compact'
    showLabel?: boolean
    /** Подпись «Юридический адрес:» перед адресом */
    showAddressLabel?: boolean
  }>(),
  { variant: 'full', showLabel: false, showAddressLabel: true },
)
</script>

<template>
  <div v-if="variant === 'compact'" class="flex flex-wrap items-center gap-x-4 gap-y-1">
    <span class="phone">ОГРН {{ legal.ogrn }}</span>
    <span class="phone">ИНН {{ legal.inn }}</span>
    <span class="phone">КПП {{ legal.kpp }}</span>
  </div>
  <div v-else class="text-sm text-muted">
    <p v-if="showLabel" class="g-kicker">Реквизиты</p>
    <p class="font-bold text-ink" :class="showLabel ? 'mt-3' : ''">
      {{ brand.legalName }}
    </p>
    <p class="mt-1">
      <template v-if="showAddressLabel">Юридический адрес: </template>{{ legal.legalAddress }}
    </p>
    <p class="mt-1 flex flex-wrap gap-x-4 gap-y-1">
      <span class="phone">ОГРН {{ legal.ogrn }}</span>
      <span class="phone">ИНН {{ legal.inn }}</span>
      <span class="phone">КПП {{ legal.kpp }}</span>
      <span class="phone">ОКПО {{ legal.okpo }}</span>
    </p>
  </div>
</template>
