<template>
  <div ref="imageContainer" class="image-container" @mousemove="handleMouseMove" @mouseleave="resetImage">
    <ClientOnly>
      <ImgSkeleton v-show="!isAllImgsLoaded" />
    </ClientOnly>
    <template v-for="(img, index) in product.img_mini" :key="index">
      <img
        v-if="!img.includes('/img/no-image.png')"
        v-show="isImgVisible && index === activeIndex"
        :src="img"
        :alt="`${product.name} – миниатюра ${index + 1}`"
        :class="['image-container__img', { active: index === activeIndex }]"
        @error="onImgError"
        @load="onImageLoad"
      />
      <ClientOnly v-else>
        <img
          v-show="isImgVisible && index === activeIndex"
          :src="img"
          alt="Фото отсутствует"
          :class="['image-container__img', { active: index === activeIndex }]"
          @error="onImgError"
          @load="onImageLoad"
        />
      </ClientOnly>
    </template>
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

onMounted(async () => {
  if (!imageContainer.value) return

  await nextTick()

  const images = imageContainer.value?.querySelectorAll?.('img')
  if (!images) return

  let loadedCount = 0

  images.forEach((img) => {
    if (img.complete) {
      loadedCount++
    }
  })

  imgsLoaded.value += loadedCount

  if (imgsLoaded.value >= totalImages) {
    isAllImgsLoaded.value = true
  }
})

const isImgVisible = computed(() => isAllImgsLoaded.value)

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

function onImageLoad(event: Event) {
  const target = event.target as HTMLImageElement
  if (target.complete) {
    imgsLoaded.value++
    if (imgsLoaded.value >= totalImages) {
      isAllImgsLoaded.value = true
    }
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
