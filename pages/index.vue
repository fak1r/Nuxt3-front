<template>
  <div class="main-page">
    <h1 class="main-page__title">Популярные товары:</h1>
    <ProductList :products="products" :is-skeleton-visible="!isSkeletonVisible" />
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'
import ProductList from '~/components/Products/Products/ProductList.vue'
import type { Product } from '~/types/products.types'

const productsStore = useProductsStore()

const { fetchPopularProducts } = productsStore

const { data, status } = await useAsyncData<Product[]>('favorite-products', () => fetchPopularProducts())

const isSkeletonVisible = computed(() => status.value === 'success' || 'error')

const products = data.value || []
</script>

<style scoped lang="scss">
.main-page {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  align-items: center;
  box-sizing: border-box;

  &__title {
    margin-bottom: 16px;
    text-align: center;
  }
}
</style>
