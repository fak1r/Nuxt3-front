<template>
  <div class="category-catalog">
    <template v-if="isLaminate">
      <header class="category-catalog__intro">
        <p class="category-catalog__eyebrow">Магазин «Зам Пол» в Коломне</p>
        <h1>Ламинат в Коломне — каталог и цены</h1>
        <p>
          Выбирайте ламинат Classen и Pergo: сравнивайте декоры, характеристики и цены в карточках товаров, чтобы найти покрытие для дома, квартиры или офиса.
        </p>
        <p>
          В карточке товара указаны характеристики покрытия, а калькулятор поможет предварительно рассчитать нужное число упаковок для вашей площади.
        </p>
      </header>

      <section class="category-catalog__guide" aria-labelledby="laminat-guide-title">
        <h2 id="laminat-guide-title">Как выбрать ламинат</h2>
        <div class="category-catalog__guide-grid">
          <article>
            <h3>Учитывайте нагрузку</h3>
            <p>Смотрите класс применения в характеристиках — он помогает подобрать покрытие под конкретное помещение.</p>
          </article>
          <article>
            <h3>Проверяйте влагостойкость</h3>
            <p>Для помещений с влажной уборкой заранее уточните соответствующую характеристику выбранного декора.</p>
          </article>
          <article>
            <h3>Рассчитайте количество</h3>
            <p>Укажите площадь и запас в калькуляторе карточки товара, чтобы увидеть число упаковок до покупки.</p>
          </article>
        </div>
      </section>

      <section class="category-catalog__collections" aria-labelledby="laminat-collections-title">
        <h2 id="laminat-collections-title">Коллекции ламината</h2>
        <p>Перейдите к бренду, затем выберите коллекцию и подходящий декор.</p>
        <ProducerCatalogSection
          v-for="producer in producerCatalog"
          :key="producer.id"
          :category-slug="categorySlug"
          :producer="producer"
          :heading-level="3"
        />
      </section>

      <section class="category-catalog__local" aria-labelledby="laminat-local-title">
        <h2 id="laminat-local-title">Ламинат в магазине «Зам Пол»</h2>
        <p>
          Магазин работает в Коломне. Наличие конкретного декора, количество упаковок и возможность доставки за пределы города уточняйте перед оформлением заказа.
        </p>
      </section>
    </template>

    <template v-else>
      <h1 class="category-catalog__title">Категория: {{ categoryName }}</h1>
      <ProducerCatalogSection
        v-for="producer in producerCatalog"
        :key="producer.id"
        :category-slug="categorySlug"
        :producer="producer"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Category, ProducerCatalogItem } from '~/types/categories.types'
import ProducerCatalogSection from '~/components/Products/Catalog/ProducerCatalogSection.vue'
import { fetchCatalogCategories, fetchCategoryCatalog } from '~/utils/catalog-api'

const route = useRoute()
const config = useRuntimeConfig()
const categorySlug = route.params.category as string

const { data: categoriesData } = await useAsyncData('catalog-categories', () =>
  fetchCatalogCategories(config.public.apiBaseUrl),
)
const { data: producerCatalogData } = await useAsyncData(`category-catalog-${categorySlug}`, () =>
  fetchCategoryCatalog(config.public.apiBaseUrl, categorySlug),
)

const categories = computed(() => (categoriesData.value ?? []) as Category[])
const category = computed(() => categories.value.find((item) => item.slug === categorySlug) ?? null)
const categoryName = computed(() => category.value?.name ?? '')
const producerCatalog = computed(() => (producerCatalogData.value ?? []) as ProducerCatalogItem[])
const isLaminate = computed(() => categorySlug === 'laminat')

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Категория не найдена' })
}

useHead(() => ({
  title: isLaminate.value ? 'Ламинат в Коломне — каталог и цены | Зам Пол' : `${categoryName.value} | Зам Пол`,
  meta: [
    {
      name: 'description',
      content: isLaminate.value
        ? 'Купить ламинат в Коломне: каталог Classen и Pergo, коллекции, характеристики и цены. Магазин напольных покрытий «Зам Пол».'
        : `${categoryName.value} в магазине Зам Пол. Напольные покрытия в наличии и под заказ в Коломне.`,
    },
    {
      property: 'og:title',
      content: isLaminate.value ? 'Ламинат в Коломне — каталог и цены | Зам Пол' : `${categoryName.value} | Зам Пол`,
    },
    {
      property: 'og:description',
      content: isLaminate.value
        ? 'Каталог ламината Classen и Pergo в Коломне: коллекции, характеристики и цены.'
        : `${categoryName.value} в магазине Зам Пол. Напольные покрытия в наличии и под заказ в Коломне.`,
    },
  ],
}))
</script>

<style scoped lang="scss">
.category-catalog {
  &__title {
    margin-bottom: 24px;
    text-align: center;
  }

  &__intro {
    max-width: 920px;
    margin: 0 auto 34px;
    text-align: center;

    h1 {
      color: #29445d;
      font-size: clamp(30px, 4vw, 42px);
      line-height: 1.12;
    }

    > p:not(.category-catalog__eyebrow) {
      max-width: 760px;
      margin: 14px auto 0;
      color: #587087;
      font-size: 17px;
      line-height: 1.55;
    }
  }

  &__eyebrow {
    margin-bottom: 10px;
    color: #a37552;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__guide,
  &__collections,
  &__local {
    margin-top: 38px;
  }

  &__guide h2,
  &__collections h2,
  &__local h2 {
    color: #29445d;
    font-size: 28px;
  }

  &__guide-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 16px;

    article {
      padding: 20px;
      border: 1px solid #d7e3ee;
      border-radius: 12px;
      background: #f8fbfd;
    }

    h3 {
      color: #456987;
      font-size: 18px;
    }

    p {
      margin-top: 8px;
      color: #587087;
      font-size: 15px;
      line-height: 1.5;
    }
  }

  &__collections > p,
  &__local p {
    max-width: 760px;
    margin-top: 10px;
    color: #587087;
    line-height: 1.55;
  }

  &__local {
    padding: 28px 0;
    border-top: 1px solid #d7e3ee;
  }

  @include phone {
    &__intro > p:not(.category-catalog__eyebrow) {
      font-size: 15px;
    }

    &__guide,
    &__collections,
    &__local {
      margin-top: 28px;
    }

    &__guide h2,
    &__collections h2,
    &__local h2 {
      font-size: 24px;
    }

    &__guide-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
}
</style>
