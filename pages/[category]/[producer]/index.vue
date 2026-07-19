<template>
  <ProductListPage :state="productPageState" @load-more="loadMoreProducts" @update-sort="onSortUpdate" />
</template>

<script setup lang="ts">
import type { Category, Producer } from '~/types/categories.types'
import type { ProductFilters } from '~/types/products.types'
import { useProductsStore } from '~/store/products'
import ProductListPage from '~/components/Products/Products/ProductListPage.vue'
import { fetchCatalogCategories, fetchCatalogProducers } from '~/utils/catalog-api'

const route = useRoute()
const config = useRuntimeConfig()
const categorySlug = route.params.category as string
const producerSlug = route.params.producer as string
const initialLimit = 30

const filters = ref<ProductFilters>({
  category_slug: categorySlug,
  producer_slug: producerSlug,
})

const parsedSort = parseSortParam(route.query.sort as string)

if (parsedSort) {
  filters.value.sort_by = parsedSort.sort_by
  filters.value.order = parsedSort.order
}

const { data: categoriesData } = await useAsyncData('catalog-categories', () =>
  fetchCatalogCategories(config.public.apiBaseUrl),
)
const { data: producersData } = await useAsyncData('catalog-producers', () =>
  fetchCatalogProducers(config.public.apiBaseUrl),
)

const categories = computed(() => (categoriesData.value ?? []) as Category[])
const producers = computed(() => (producersData.value ?? []) as Producer[])
const category = computed(() => categories.value.find((item) => item.slug === categorySlug) ?? null)
const producer = computed(() => {
  if (!category.value) return null

  return producers.value.find((item) => item.slug === producerSlug && item.category_id === category.value.id) ?? null
})
const producerName = computed(() => producer.value?.name ?? '')

if (!category.value || !producer.value) {
  throw createError({ statusCode: 404, statusMessage: 'Производитель не найден' })
}

const { fetchProducts } = useProductsStore()
const { data: initialProductsData } = await useAsyncData(`producer-products-${categorySlug}-${producerSlug}`, () =>
  fetchProducts({
    ...filters.value,
    page: 1,
    limit: initialLimit,
  }),
)

const initialProducts = initialProductsData.value?.products ?? []

const { productPageState, loadMoreProducts } = useProductListPage({
  titlePrefix: 'Производитель',
  title: producerName,
  filters,
  slugListRef: producers,
  slugToCheck: producerSlug,
  initialProducts,
  initialLimit,
})

useHead(() => ({
  title: `${producerName.value} | Зам Пол`,
  meta: [
    {
      name: 'description',
      content: `${producerName.value} в магазине Зам Пол. Напольные покрытия в наличии и под заказ в Коломне.`,
    },
    {
      property: 'og:title',
      content: `${producerName.value} | Зам Пол`,
    },
    {
      property: 'og:description',
      content: `${producerName.value} в магазине Зам Пол. Напольные покрытия в наличии и под заказ в Коломне.`,
    },
  ],
}))

function onSortUpdate(sort: { sort_by: string; order: 'asc' | 'desc' } | null) {
  if (sort) {
    filters.value.sort_by = sort.sort_by
    filters.value.order = sort.order
  }
}
</script>

<style scoped lang="scss">
.categories {
  &__title {
    margin-bottom: 16px;
    text-align: center;
  }

  &__loader {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>
