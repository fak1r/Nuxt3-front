<template>
  <div class="main-page">
    <h1 class="main-page__title">Популярные товары:</h1>
    <ProductList :products="products" />
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'
import ProductList from '~/components/Products/ProductList.vue'

definePageMeta({
  middleware: 'auth',
})

const productsStore = useProductsStore()
const { fetchProducts } = productsStore

const { data: products } = await useAsyncData('favorite-products', () => fetchProducts({ favorite: true }))
</script>

<style scoped lang="scss">
.main-page {
  &__title {
    margin-bottom: 16px;
    text-align: center;
  }
}
</style>
