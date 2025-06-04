<template>
  <div v-if="!isSkeletonVisible && safeProducts.length === 0" class="product-list__not-found">Товары не найдены</div>
  <ul v-else class="product-list">
    <template v-if="isSkeletonVisible && safeProducts.length === 0">
      <li v-for="n in 8" :key="n">
        <ProductCardSkeleton />
      </li>
    </template>

    <template v-else>
      <li v-for="product in safeProducts" :key="product.id">
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
  products?: Product[]
  isSkeletonVisible?: boolean
}

const props = defineProps<Props>()

const safeProducts = computed(() => (Array.isArray(props.products) ? props.products : []))
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
