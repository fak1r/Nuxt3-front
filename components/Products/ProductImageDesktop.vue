<template>
  <div ref="imageContainer" class="image-container" @mousemove="handleMouseMove" @mouseleave="resetImage">
    <ImgSkeleton v-if="!isAllImgsLoaded" />
    <img
      v-for="(img, index) in product.img_mini"
      v-show="isAllImgsLoaded && index === activeIndex"
      :key="index"
      :src="img"
      :alt="`Фото ${index}`"
      :class="['image-container__img', { active: index === activeIndex }]"
      @error="onImgError"
      @load="onImageLoad"
    />
    <div v-if="hasImgs" class="image-container__pagination">
      <span v-for="(_, index) in product.img_mini" :key="index" :class="{ active: index === activeIndex }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/products.types'
import ImgSkeleton from '~/components/Products/ImgSkeleton.vue'

interface Props {
  product: Product
}

const { product } = defineProps<Props>()

const imageContainer = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const hasImgs = computed(() => product.img_mini.length > 1)
const isAllImgsLoaded = ref(false)
const totalImages = product.img_mini.length
const imgsLoaded = ref(0)

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

function onImgError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/img/no-image.png'
}

function onImageLoad() {
  imgsLoaded.value++
  if (imgsLoaded.value === totalImages) {
    isAllImgsLoaded.value = true
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
