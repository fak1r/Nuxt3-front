<template>
  <div class="product-page">
    <h1 class="product-page__title">{{ state.titlePrefix }}: {{ state.title }}</h1>

    <ProductList :products="state.products ?? []" :is-skeleton-visible="isSkeletonVisible" />

    <div v-if="state.firstLoading" class="product-page__loader">
      <TheLoader size="xl" />
    </div>
    <div v-if="!state.firstLoading && state.productsAreLoading && state.hasMore" class="product-page__loader">
      <TheLoader size="md" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductListState } from '~/types/products.types'
import ProductList from '~/components/Products/Products/ProductList.vue'
import TheLoader from '~/components/UI/TheLoader.vue'

interface Props {
  state: ProductListState
}

const props = defineProps<Props>()

interface Emits {
  (e: 'loadMore'): void
}

const emit = defineEmits<Emits>()

const isSkeletonVisible = computed(() => props.state.firstLoading)

useInfiniteScroll(() => emit('loadMore'))
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
