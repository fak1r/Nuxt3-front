<template>
  <div class="product-page">
    <h1 class="product-page__title">{{ titlePrefix }}: {{ title }}</h1>

    <ProductList :products="products" :is-skeleton-visible="isSkeletonVisible" />

    <div class="product-page__loader">
      <TheLoader v-if="firstLoading" size="xl" />
      <TheLoader v-if="!firstLoading && productsAreLoading && hasMore" size="md" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductFilters } from '~/types/products.types'
import ProductList from '~/components/Products/ProductList.vue'
import TheLoader from '~/components/UI/TheLoader.vue'
import { useInfiniteProducts } from '~/composables/useInfiniteProducts'
import { useInfiniteScroll } from '~/composables/useInfiniteScroll'

interface Props {
  title: string
  filters: unknown
  titlePrefix?: string
}

const props = defineProps<Props>()

const { products, loadMoreProducts, productsAreLoading, hasMore, firstLoading } = useInfiniteProducts(
  props.filters as Ref<ProductFilters>,
)

const isSkeletonVisible = computed(() => firstLoading.value)

onMounted(async () => {
  await loadMoreProducts()
  firstLoading.value = false
})

useInfiniteScroll(loadMoreProducts)
</script>

<style scoped lang="scss">
.product-page {
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
