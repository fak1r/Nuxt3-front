<template>
  <article class="product-card">
    <template v-if="isMobile">
      <ProductImageMobile :product="product" />
    </template>
    <template v-else>
      <ProductImageDesktop :product="product" />
    </template>
    <p class="product-card__price">{{ product.price }} ₽</p>
    <h3 class="product-card__name">{{ product.name }}</h3>
  </article>
</template>

<script setup lang="ts">
import ProductImageMobile from '~/components/Products/ProductImageMobile.vue'
import ProductImageDesktop from '~/components/Products/ProductImageDesktop.vue'
import type { Product } from '~/types/products.types'

interface Props {
  product: Product
}

const { product } = defineProps<Props>()

const { isMobile } = useIsMobile()

const imageContainer = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        preloadImages()
        observer?.disconnect()
      }
    },
    {
      rootMargin: '100px',
      threshold: 0.1,
    },
  )

  if (imageContainer.value) {
    observer.observe(imageContainer.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

function preloadImages() {
  for (const img of product.images) {
    const preloadImg = document.createElement('img')
    preloadImg.src = img.image_url as string
    preloadImg.style.display = 'none'
    preloadImg.alt = 'Предзагрузка'
    document.body.appendChild(preloadImg)

    setTimeout(() => {
      preloadImg.remove()
    }, 3000)
  }
}
</script>

<style scoped lang="scss">
.product-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
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
