<template>
  <article class="product-view">
    <!-- <div class="product-view__gallery">
      <ImageSlider :images="product.img_mini" />
    </div>

    <div class="product-view__info">
      <h1 class="product-view__title">{{ product.name }}</h1>
      <p class="product-view__price">{{ product.price }} ₽</p>

      <ul class="product-view__details">
        <li v-for="(value, key) in product.details" :key="key" class="product-view__detail">
          <strong>{{ key }}:</strong> {{ value }}
        </li>
      </ul>
    </div> -->
    {{ product }}
  </article>
</template>

<script setup lang="ts">
// import type { ProductResponse } from '~/types/products.types'
// import ImageSlider from '~/components/Products/Product/ImageSlider.vue'

interface Props {
  product: any
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.product-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;

  &__gallery {
    width: 100%;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
  }

  &__price {
    font-size: 20px;
    color: #000;
    font-weight: bold;
  }

  &__details {
    list-style: none;
    padding: 0;

    & > .product-view__detail {
      font-size: 14px;
      line-height: 1.4;
      margin-bottom: 4px;
    }
  }
}
</style>
