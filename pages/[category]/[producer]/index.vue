<template>
  <section v-if="producer" class="producer-page">
    <TheBreadcrumbs :breadcrumbs="breadcrumbs" />
    <ProducerCatalogSection :category-slug="categorySlug" :producer="producer" />
  </section>
</template>

<script setup lang="ts">
import type { Category, ProducerCatalogItem } from '~/types/categories.types'
import type { BreadcrumbItem } from '~/types/products.types'
import ProducerCatalogSection from '~/components/Products/Catalog/ProducerCatalogSection.vue'
import TheBreadcrumbs from '~/components/UI/TheBreadcrumbs.vue'
import { fetchCatalogCategories, fetchCategoryCatalog } from '~/utils/catalog-api'

const route = useRoute()
const config = useRuntimeConfig()
const categorySlug = route.params.category as string
const producerSlug = route.params.producer as string

const { data: categoriesData } = await useAsyncData('catalog-categories', () =>
  fetchCatalogCategories(config.public.apiBaseUrl),
)
const { data: producerCatalogData } = await useAsyncData(`category-catalog-${categorySlug}`, () =>
  fetchCategoryCatalog(config.public.apiBaseUrl, categorySlug),
)

const category = computed(() =>
  ((categoriesData.value ?? []) as Category[]).find((item) => item.slug === categorySlug) ?? null,
)
const producer = computed(() =>
  ((producerCatalogData.value ?? []) as ProducerCatalogItem[]).find((item) => item.slug === producerSlug) ?? null,
)
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  if (!category.value || !producer.value) return []

  return [
    { label: category.value.name, to: `/${category.value.slug}` },
    { label: producer.value.name, to: `/${category.value.slug}/${producer.value.slug}` },
  ]
})

if (!category.value || !producer.value) {
  throw createError({ statusCode: 404, statusMessage: 'Производитель не найден' })
}

useHead(() => ({
  title: `${producer.value?.name} | Зам Пол`,
  meta: [
    {
      name: 'description',
      content: `${producer.value?.name} в магазине Зам Пол. Напольные покрытия в наличии и под заказ в Коломне.`,
    },
    {
      property: 'og:title',
      content: `${producer.value?.name} | Зам Пол`,
    },
    {
      property: 'og:description',
      content: `${producer.value?.name} в магазине Зам Пол. Напольные покрытия в наличии и под заказ в Коломне.`,
    },
  ],
}))
</script>

<style scoped lang="scss">
.producer-page {
  display: flex;
  flex-direction: column;
}
</style>
