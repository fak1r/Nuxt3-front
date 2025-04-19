<template>
  <div v-if="!isSkeletonVisible && products.length === 0" class="product-list__not-found">Товары не найдены</div>
  <ul v-else class="product-list">
    <template v-if="isSkeletonVisible">
      <li v-for="n in 8" :key="n">
        <ProductCardSkeleton />
      </li>
    </template>

    <template v-else>
      <li v-for="product in products" :key="product.id">
        <ProductCard :product="product" />
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import ProductCard from '~/components/Products/Products/ProductCard.vue'
import ProductCardSkeleton from '~/components/Products/Products/ProductCardSkeleton.vue'
import type { Product } from '~/types/products.types'

interface Props {
  products: Array<Product>
  isSkeletonVisible: boolean
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

  &__not-found {
    text-align: center;
  }
}
</style>
