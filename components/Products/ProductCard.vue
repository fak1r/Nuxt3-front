<template>
  <article class="product-card">
    <div
      ref="imageContainer"
      class="product-card__image-container"
      @mousemove="handleMouseMove"
      @mouseleave="resetImage"
    >
      <img :src="currentImage" alt="Фото товара" />
      <div v-if="hasImgs" class="product-card__indicators">
        <span v-for="(_, index) in product.images" :key="index" :class="{ active: index === activeIndex }" />
      </div>
    </div>
    <p class="product-card__price">{{ product.price }} ₽</p>
    <h3 class="product-card__name">{{ product.name }}</h3>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '~/types/products.types'

interface Props {
  product: Product
}

const { product } = defineProps<Props>()

const imageContainer = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const currentImage = computed(() => product.images[activeIndex.value]?.image_url || '/img/no-image.png')
const hasImgs = computed(() => product.images.length > 1)

function handleMouseMove(event: MouseEvent) {
  if (!imageContainer.value || !product.images.length) return

  const rect = imageContainer.value.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const newIndex = Math.floor((offsetX / rect.width) * product.images.length)
  activeIndex.value = Math.min(newIndex, product.images.length - 1)
}

function resetImage() {
  activeIndex.value = 0
}
</script>

<style scoped lang="scss">
.product-card {
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;

  &__image-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;

    img {
      max-width: 100%;
      height: 230px;
      border-radius: 8px;
      transition: opacity 0.3s ease-in-out;
      object-fit: cover;
    }
  }

  &__indicators {
    display: flex;
    gap: 4px;

    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ccc;
      transition: background 0.3s ease-in-out;

      &.active {
        background: #000;
      }
    }
  }

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
