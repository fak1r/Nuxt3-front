<template>
  <ul class="product-list">
    <li v-for="product in products" :key="product.id">
      <ProductCard :product="product" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import ProductCard from '~/components/Products/ProductCard.vue'
import type { Product } from '~/types/products.types'

interface Props {
  products: Array<Product>
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
  gap: 8px;
  width: 100%;

  @include phone {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>
