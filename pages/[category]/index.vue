<template>
  <ProductListPage :state="productPageState" @load-more="loadMoreProducts" @update-sort="onSortUpdate" />
</template>

<script setup lang="ts">
import type { Category } from '~/types/categories.types'
import type { ProductFilters } from '~/types/products.types'
import { useProductsStore } from '~/store/products'
import ProductListPage from '~/components/Products/Products/ProductListPage.vue'
import { fetchCatalogCategories } from '~/utils/catalog-api'

const route = useRoute()
const config = useRuntimeConfig()
const categorySlug = route.params.category as string
const initialLimit = 30

const filters = ref<ProductFilters>({
  category_slug: categorySlug,
})

const parsedSort = parseSortParam(route.query.sort as string)

if (parsedSort) {
  filters.value.sort_by = parsedSort.sort_by
  filters.value.order = parsedSort.order
}

const { data: categoriesData } = await useAsyncData('catalog-categories', () =>
  fetchCatalogCategories(config.public.apiBaseUrl),
)

const categories = computed(() => (categoriesData.value ?? []) as Category[])
const category = computed(() => categories.value.find((item) => item.slug === categorySlug) ?? null)
const categoryName = computed(() => category.value?.name ?? '')

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Категория не найдена' })
}

const { fetchProducts } = useProductsStore()
const { data: initialProductsData } = await useAsyncData(`category-products-${categorySlug}`, () =>
  fetchProducts({
    ...filters.value,
    page: 1,
    limit: initialLimit,
  }),
)

const initialProducts = initialProductsData.value?.products ?? []

const { productPageState, loadMoreProducts } = useProductListPage({
  titlePrefix: 'Категория',
  title: categoryName,
  filters,
  slugListRef: categories,
  slugToCheck: categorySlug,
  initialProducts,
  initialLimit,
})

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
