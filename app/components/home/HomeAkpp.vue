<script setup lang="ts">
import { media } from '~/data/media'

const points = [
  'Полная замена жидкости через аппарат',
  'Оригинальное ATF или одобренные аналоги',
  'Промывка и замена фильтра при необходимости',
]
</script>

<template>
  <section id="akpp" class="relative scroll-mt-20 bg-white">
    <SectionSplit>
      <p class="g-label">АКПП</p>
      <h2 class="g-h g-h2">Аппаратная замена масла в&nbsp;АКПП — <b>в день записи</b></h2>

      <p class="g-lead mt-5">
        Полная замена ATF через аппарат. При необходимости — промывка системы и замена фильтра.
        Работы на техцентре по предварительной записи.
      </p>

      <template #media>
        <img
          :src="media.home.akpp"
          alt=""
          class="mx-auto block w-full max-h-44 object-contain object-center lg:max-h-[32rem]"
          loading="lazy"
        />
      </template>

      <template #body>
        <ul class="grid gap-3 md:grid-cols-2">
          <CheckItem v-for="p in points" :key="p" variant="boxed">
            {{ p }}
          </CheckItem>
        </ul>

        <div class="mt-8">
          <NavButton to="/service#akpp-oil" class="w-full md:w-auto">Запись на АКПП</NavButton>
        </div>
      </template>
    </SectionSplit>
  </section>
</template>
