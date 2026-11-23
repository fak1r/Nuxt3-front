<template>
  <section class="collection-page">
    <TheBreadcrumbs :breadcrumbs="breadcrumbs" />
    <ProductListPage :state="productPageState" @load-more="loadMoreProducts" @update-sort="onSortUpdate" />
  </section>
</template>

<script setup lang="ts">
import type { Category, Producer, ProductLine } from '~/types/categories.types'
import type { BreadcrumbItem, Product, ProductFilters } from '~/types/products.types'
import ProductListPage from '~/components/Products/Products/ProductListPage.vue'
import TheBreadcrumbs from '~/components/UI/TheBreadcrumbs.vue'
import { useProductsStore } from '~/store/products'
import { fetchCatalogCategories, fetchCatalogProductLines, fetchCatalogProducers } from '~/utils/catalog-api'
import { normalizeInternalPath } from '~/utils/get-safe-route-redirect'

const route = useRoute()
const config = useRuntimeConfig()
const categorySlug = route.params.category as string
const producerSlug = route.params.producer as string
const collectionSlug = route.params.collection as string
const initialLimit = 30
const filters = ref<ProductFilters>({
  category_slug: categorySlug,
  producer_slug: producerSlug,
  product_line_slug: collectionSlug,
})

const parsedSort = parseSortParam(route.query.sort as string)
if (parsedSort) {
  filters.value.sort_by = parsedSort.sort_by
  filters.value.order = parsedSort.order
}

const [categoriesData, producersData, linesData] = await Promise.all([
  fetchCatalogCategories(config.public.apiBaseUrl),
  fetchCatalogProducers(config.public.apiBaseUrl),
  fetchCatalogProductLines(config.public.apiBaseUrl),
])

const category = (categoriesData as Category[]).find((item) => item.slug === categorySlug)
const producer = (producersData as Producer[]).find(
  (item) => item.slug === producerSlug && item.category_id === category?.id,
)
const collection = (linesData as ProductLine[]).find(
  (item) => item.slug === collectionSlug && item.producer_id === producer?.id,
)

if (!category || !producer) {
  throw createError({ statusCode: 404, statusMessage: 'Коллекция не найдена' })
}

// A legacy product URL has the same three-segment shape as a collection URL.
// If the third segment is not a collection, resolve it through the legacy API
// and redirect to the canonical URL that includes the collection slug.
if (!collection) {
  const { data: legacyProduct, error: legacyProductError } = await useAsyncData<Product>(
    `legacy-product-${categorySlug}-${producerSlug}-${collectionSlug}`,
    () =>
      $fetch(`/products/${categorySlug}/${producerSlug}/${collectionSlug}`, {
        baseURL: config.public.apiBaseUrl,
      }),
  )

  if (!legacyProductError.value && legacyProduct.value?.self) {
    await navigateTo(normalizeInternalPath(legacyProduct.value.self), { redirectCode: 301 })
  }

  throw createError({ statusCode: 404, statusMessage: 'Коллекция не найдена' })
}

const { fetchProducts } = useProductsStore()
const { data: initialProductsData } = await useAsyncData(`collection-products-${categorySlug}-${producerSlug}-${collectionSlug}`, () =>
  fetchProducts({ ...filters.value, page: 1, limit: initialLimit }),
)

const { productPageState, loadMoreProducts } = useProductListPage({
  titlePrefix: 'Коллекция',
  title: computed(() => collection.name),
  filters,
  slugListRef: computed(() => [collection]),
  slugToCheck: collectionSlug,
  initialProducts: initialProductsData.value?.products ?? [],
  initialLimit,
})

const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  { label: category.name, to: `/${category.slug}` },
  { label: producer.name, to: `/${category.slug}/${producer.slug}` },
  { label: collection.name, to: `/${category.slug}/${producer.slug}/${collection.slug}` },
])

useHead(() => ({ title: `${collection.name} | ${producer.name} | Зам Пол` }))

function onSortUpdate(sort: { sort_by: string; order: 'asc' | 'desc' } | null) {
  if (!sort) return
  filters.value.sort_by = sort.sort_by
  filters.value.order = sort.order
}
</script>

<style scoped lang="scss">
.collection-page {
  display: flex;
  flex-direction: column;
}
</style>
