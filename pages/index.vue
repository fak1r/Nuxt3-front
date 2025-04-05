<template>
  <div class="main-page">
    <h1 class="main-page__title">Популярные товары:</h1>
    <ProductList :products="products" />
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'
import ProductList from '~/components/Products/ProductList.vue'
import type { Product } from '~/types/products.types'

definePageMeta({
  middleware: 'auth',
})

const productsStore = useProductsStore()
const { fetchProducts } = productsStore

const { data } = await useAsyncData<Product[]>('favorite-products', () => fetchProducts({ favorite: true }))
const products = data.value || []
</script>

<style scoped lang="scss">
.main-page {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: var(--main-padding);
  box-sizing: border-box;

  &__title {
    margin-bottom: 16px;
    text-align: center;
  }
}
</style>
