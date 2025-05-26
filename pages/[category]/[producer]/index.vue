<template>
  <ProductListPage :state="productPageState" @load-more="loadMoreProducts" />
</template>

<script setup lang="ts">
import type { ProductFilters } from '~/types/products.types'
import { useCategoriesStore } from '~/store/categories'
import ProductListPage from '~/components/Products/Products/ProductListPage.vue'

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

const producerName = computed(() => {
  return Array.isArray(producers.value) ? (producers.value.find((p) => p.slug === producerSlug)?.name ?? '') : ''
})

const { productPageState, loadMoreProducts } = useProductListPage({
  titlePrefix: 'Производитель',
  title: producerName,
  filters,
  slugListRef: producers,
  slugToCheck: producerSlug,
})

onMounted(() => {
  loadMoreProducts()
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
