<template>
  <div class="category-catalog">
    <h1 class="category-catalog__title">Категория: {{ categoryName }}</h1>
    <ProducerCatalogSection
      v-for="producer in producerCatalog"
      :key="producer.id"
      :category-slug="categorySlug"
      :producer="producer"
    />
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

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Категория не найдена' })
}

useHead(() => ({
  title: `${categoryName.value} | Зам Пол`,
  meta: [
    {
      name: 'description',
      content: `${categoryName.value} в магазине Зам Пол. Напольные покрытия в наличии и под заказ в Коломне.`,
    },
    {
      property: 'og:title',
      content: `${categoryName.value} | Зам Пол`,
    },
    {
      property: 'og:description',
      content: `${categoryName.value} в магазине Зам Пол. Напольные покрытия в наличии и под заказ в Коломне.`,
    },
  ],
}))
</script>

<style scoped lang="scss">
.category-catalog__title {
  margin-bottom: 24px;
  text-align: center;
}
</style>
