<template>
  <article class="product-card">
    <a :href="product.self" class="product-card__link" @click.prevent="goToProduct">
      <template v-if="showMobileImage">
        <ProductImageMobile v-if="hasImgs" :product="product" />
      </template>
      <template v-else>
        <ProductImageDesktop v-if="hasImgs" :product="product" />
      </template>

      <p class="product-card__price">{{ product.price }} ₽</p>
      <h3 class="product-card__name">{{ product.name }}</h3>
    </a>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '~/types/products.types'
import ProductImageMobile from '~/components/Products/Products/ProductImageMobile.vue'
import ProductImageDesktop from '~/components/Products/Products/ProductImageDesktop.vue'

interface Props {
  product: Product
}

const { product } = defineProps<Props>()

const router = useRouter()

const { isMobile } = import.meta.client ? useIsMobile() : { isMobile: ref(false) }

const showMobileImage = computed(() => isMobile.value === true)

const hasImgs = computed(() => Array.isArray(product.img_mini) && product.img_mini.length)

function goToProduct() {
  if (import.meta.client) {
    router.push(product.self)
  }
}
</script>

<style scoped lang="scss">
.product-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;

  &__price {
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
  }

  &__name {
    font-size: 16px;
    line-height: 20px;
    text-align: center;
  }
}
</style>
