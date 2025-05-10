<template>
  <ProductListPage :state="productPageState" @load-more="loadMoreProducts" />
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app'
import type { ProductFilters, PaginatedProducts } from '~/types/products.types'
import type { Producer } from '~/types/categories.types'
import { useCategoriesStore } from '~/store/categories'
import ProductListPage from '~/components/Products/Products/ProductListPage.vue'

const config = useRuntimeConfig()
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

const limit = config.public.isStatic ? 9999 : 30

const producerName = computed(() => {
  return producersData.value?.find((p) => p.slug === producerSlug)?.name ?? ''
})

const { data: producersData } = await useAsyncData<Producer[]>('producers', () =>
  $fetch('/products/producers', {
    baseURL: config.public.apiBaseUrl,
  }),
)

const { data: ssrProducts } = await useAsyncData<PaginatedProducts>(`products-${categorySlug}-${producerSlug}`, () =>
  $fetch(`/products/${categorySlug}/${producerSlug}`, {
    baseURL: config.public.apiBaseUrl,
    params: {
      page: 1,
      limit: limit,
      sort_by: 'name',
      order: 'asc',
    },
  }),
)

const { productPageState, loadMoreProducts } = useProductListPage({
  titlePrefix: 'Производитель',
  title: producerName,
  filters,
  ssrProducts: ssrProducts.value ?? null,
  slugListRef: producers,
  slugToCheck: producerSlug,
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
