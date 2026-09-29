<script setup lang="ts">
import { brand, legal } from '~/data/site'

useSeoMeta({
  title: `Политика обработки персональных данных — ${brand.name}`,
  description: `Политика обработки персональных данных ${brand.legalName}`,
})
</script>

<template>
  <div>
    <PageHero label="Документы">
      <template #title>
        Политика обработки<br class="hidden md:block" />
        <b>персональных данных</b>
      </template>
      <template #lead>
        Порядок сбора и обработки данных, которые вы оставляете через сайт {{ brand.name }}.
      </template>
    </PageHero>

    <div class="mx-auto max-w-3xl space-y-8 px-5 py-14 text-[1.0625rem] leading-relaxed text-ink md:px-6 md:py-16">
      <section class="space-y-3">
        <h2 class="g-display text-xl font-bold">1. Оператор</h2>
        <p>
          Оператор персональных данных: {{ brand.legalName }} (ИНН {{ legal.inn }}, ОГРН
          {{ legal.ogrn }}).
        </p>
        <p>Адрес: {{ legal.legalAddress }}.</p>
        <p>
          Контакт для обращений по персональным данным:
          <a :href="`mailto:${brand.email}`" class="g-link-accent font-semibold">
            {{ brand.email }}
          </a>
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="g-display text-xl font-bold">2. Какие данные обрабатываем</h2>
        <p>При отправке заявки на обратный звонок мы можем получить:</p>
        <ul class="list-disc space-y-1 pl-5 text-muted">
          <li>имя;</li>
          <li>номер телефона;</li>
          <li>технические данные запроса (IP-адрес, время обращения) — для защиты от спама.</li>
        </ul>
        <p>При отправке отзыва через форму на сайте мы можем получить:</p>
        <ul class="list-disc space-y-1 pl-5 text-muted">
          <li>имя или псевдоним автора;</li>
          <li>оценку (рейтинг);</li>
          <li>текст отзыва;</li>
          <li>технические данные запроса (IP-адрес, время обращения) — для защиты от спама.</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="g-display text-xl font-bold">3. Цели обработки</h2>
        <ul class="list-disc space-y-1 pl-5 text-muted">
          <li>связь с вами по заявке на обратный звонок;</li>
          <li>консультирование по услугам автотехцентра и магазина;</li>
          <li>модерация и учёт отзывов, оставленных через сайт;</li>
          <li>защита сайта от автоматизированных и злоупотребляющих обращений.</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="g-display text-xl font-bold">4. Правовые основания</h2>
        <p>
          Обработка осуществляется на основании согласия субъекта персональных данных (ст. 6, 9
          Федерального закона № 152-ФЗ «О персональных данных»), которое вы даёте при отправке
          формы на сайте.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="g-display text-xl font-bold">5. Срок хранения</h2>
        <p>
          Данные заявки и отзыва хранятся не дольше, чем это необходимо для обработки обращения,
          модерации отзыва и исполнения связанных обязательств, либо до отзыва согласия — если иное
          не требуется законом.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="g-display text-xl font-bold">6. Передача третьим лицам</h2>
        <p>
          Мы не продаём персональные данные. Передача возможна только если это нужно для связи с
          вами (например, сервисы уведомлений) или по требованию закона.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="g-display text-xl font-bold">7. Ваши права</h2>
        <p>
          Вы можете запросить уточнение, блокирование или удаление своих данных, а также отозвать
          согласие — напишите на
          <a :href="`mailto:${brand.email}`" class="g-link-accent font-semibold">
            {{ brand.email }}
          </a>.
        </p>
      </section>

      <p class="text-sm text-muted">Актуальная редакция опубликована на этой странице.</p>
    </div>
  </div>
</template>
