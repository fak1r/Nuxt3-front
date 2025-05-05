<template>
  <ProductListPage :state="productPageState" @load-more="loadMoreProducts" />
</template>

<script setup lang="ts">
import type { ProductFilters, PaginatedProducts } from '~/types/products.types'
import ProductListPage from '~/components/Products/Products/ProductListPage.vue'
import { useCategoriesStore } from '~/store/categories'

const route = useRoute()
const categorySlug = route.params.category as string
const producerSlug = route.params.producer as string

const filters = ref<ProductFilters>({
  category_slug: categorySlug,
  producer_slug: producerSlug,
  sort_by: 'price',
  order: 'asc',
})

const { producers } = storeToRefs(useCategoriesStore())

const { data: ssrProducts } = await useAsyncData<PaginatedProducts>(`products-${categorySlug}-${producerSlug}`, () =>
  $fetch(`/products/${categorySlug}/${producerSlug}`, {
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    params: {
      page: 1,
      limit: 9999,
      sort_by: 'name',
      order: 'asc',
    },
  }),
)

const { productPageState, loadMoreProducts } = useProductListPage({
  titlePrefix: 'Производитель',
  getTitleBySlug: (slug) => (Array.isArray(producers.value) ? producers.value.find((p) => p.slug === slug)?.name : ''),
  validateSlugExists: () => Array.isArray(producers.value) && !!producers.value.find((p) => p.slug === producerSlug),
  filters,
  ssrProducts: ssrProducts.value ?? null,
})
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
