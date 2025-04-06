<template>
  <div ref="imageContainer" class="image-container" @mousemove="handleMouseMove" @mouseleave="resetImage">
    <img :src="currentImage" alt="Фото товара" />
    <div v-if="hasImgs" class="image-container__pagination">
      <span v-for="(_, index) in product.img_mini" :key="index" :class="{ active: index === activeIndex }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Product } from '~/types/products.types'

interface Props {
  product: Product
}

const { product } = defineProps<Props>()

const imageContainer = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const currentImage = computed(() => product.img_mini[activeIndex.value])
const hasImgs = computed(() => product.img_mini.length > 1)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        preloadImages()
        observer.disconnect()
      }
    },
    { rootMargin: '100px', threshold: 0.1 },
  )

  if (imageContainer.value) {
    observer.observe(imageContainer.value)
  }
})

function handleMouseMove(event: MouseEvent) {
  if (!imageContainer.value || !product.img_mini.length) return

  const rect = imageContainer.value.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const newIndex = Math.floor((offsetX / rect.width) * product.img_mini.length)
  activeIndex.value = Math.min(newIndex, product.img_mini.length - 1)
  if (activeIndex.value === -1) activeIndex.value = 0
}

function resetImage() {
  activeIndex.value = 0
}

function preloadImages() {
  for (const img of product.img_mini) {
    const preloadImg = document.createElement('img')
    preloadImg.src = img
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
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  aspect-ratio: 4 / 3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__pagination {
    display: flex;
    width: 100%;
    height: 2px;
    background-color: #d6d6db;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;

    span {
      flex: 1;

      &.active {
        background-color: #000;
      }
    }
  }

  &:hover &__pagination {
    opacity: 1;
  }
}
</style>
