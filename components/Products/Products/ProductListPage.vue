<template>
  <div class="product-page">
    <h1 class="product-page__title">{{ state.titlePrefix }}: {{ state.title }}</h1>
    <TheSort class="product-page__sort" :initial-order="state.order" @update:sort="onSortChange" />
    <ProductList :products="state.products ?? []" :is-skeleton-visible="isFirstLoading" />

    <div v-if="isFirstLoading" class="product-page__loader">
      <TheLoader size="xl" />
    </div>
    <div v-if="!isFirstLoading && state.productsAreLoading && state.hasMore" class="product-page__loader">
      <TheLoader size="md" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductListState } from '~/types/products.types'
import ProductList from '~/components/Products/Products/ProductList.vue'
import TheLoader from '~/components/UI/TheLoader.vue'
import TheSort from '~/components/UI/TheSort.vue'

interface Props {
  state: ProductListState
}

const props = defineProps<Props>()

interface Emits {
  (e: 'loadMore'): void
  (e: 'updateSort', sort: { sort_by: string; order: 'asc' | 'desc' } | null): void
}

const emit = defineEmits<Emits>()

const isFirstLoading = computed(() => props.state.firstLoading)

useInfiniteScroll(() => emit('loadMore'))

function onSortChange(sort: { sort_by: string; order: 'asc' | 'desc' }) {
  emit('updateSort', sort)
}
</script>

<style scoped lang="scss">
.product-page {
  &__title {
    margin-bottom: 16px;
    text-align: center;
  }

  &__sort {
    margin-bottom: 16px;
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
