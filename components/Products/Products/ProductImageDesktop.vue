<template>
  <div ref="imageContainer" class="image-container" @mousemove="handleMouseMove" @mouseleave="resetImage">
    <ClientOnly>
      <ImgSkeleton v-if="showSkeleton" class="image-container__skeleton" />
    </ClientOnly>
    <template v-for="(img, index) in product.img_mini" :key="index">
      <img
        v-if="isSlideRequested(index) && !img.includes('/img/no-image.png')"
        :data-index="index"
        :class="[
          'image-container__img',
          { active: index === displayedIndex, 'image-container__img--hidden': index !== displayedIndex || !isSlideLoaded(index) },
        ]"
        :src="img"
        :alt="product.name"
        loading="eager"
        decoding="async"
        @error="onImgError(index, $event)"
        @load="onImageLoad(index)"
      />
      <ClientOnly v-else-if="isSlideRequested(index)">
        <img
          :data-index="index"
          :class="[
            'image-container__img',
            { active: index === displayedIndex, 'image-container__img--hidden': index !== displayedIndex || !isSlideLoaded(index) },
          ]"
          :src="img"
          alt="No image"
          loading="eager"
          decoding="async"
          @error="onImgError(index, $event)"
          @load="onImageLoad(index)"
        />
      </ClientOnly>
    </template>
    <div v-if="hasImgs" class="image-container__pagination">
      <span v-for="(_, index) in product.img_mini" :key="index" :class="{ active: index === displayedIndex }" />
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
const displayedIndex = ref(0)
const pendingIndex = ref<number | null>(null)
const requestedSlides = ref<Record<number, boolean>>({})
const loadedSlides = ref<Record<number, boolean>>({})

const hasImgs = computed(() => product.img_mini.length > 1)
const showSkeleton = computed(() => !isSlideLoaded(displayedIndex.value))

watch(
  () => product.img_mini,
  () => {
    displayedIndex.value = 0
    pendingIndex.value = null
    requestedSlides.value = {}
    loadedSlides.value = {}
    requestAround(0)
  },
  { immediate: true },
)

onMounted(async () => {
  if (!imageContainer.value) return

  await nextTick()

  const images = imageContainer.value.querySelectorAll('img')

  images.forEach((img) => {
    if (!img.complete) return

    const index = Number(img.getAttribute('data-index'))

    if (Number.isFinite(index)) {
      loadedSlides.value[index] = true
    }
  })
})

function handleMouseMove(event: MouseEvent) {
  if (!imageContainer.value || !product.img_mini.length) return

  const rect = imageContainer.value.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const newIndex = Math.floor((offsetX / rect.width) * product.img_mini.length)
  const nextIndex = Math.max(0, Math.min(newIndex, product.img_mini.length - 1))

  requestAround(nextIndex)

  if (isSlideLoaded(nextIndex)) {
    displayedIndex.value = nextIndex
    pendingIndex.value = null
    return
  }

  pendingIndex.value = nextIndex
}

function resetImage() {
  pendingIndex.value = null
  displayedIndex.value = 0
  requestAround(0)
}

function requestSlide(index: number) {
  if (index < 0 || index >= product.img_mini.length) return
  if (requestedSlides.value[index]) return
  requestedSlides.value[index] = true
}

function requestAround(index: number) {
  requestSlide(index - 1)
  requestSlide(index)
  requestSlide(index + 1)
}

function isSlideRequested(index: number) {
  return !!requestedSlides.value[index]
}

function isSlideLoaded(index: number) {
  return !!loadedSlides.value[index]
}

function onImgError(index: number, event: Event) {
  const target = event.target as HTMLImageElement

  if (target.src.includes('/img/no-image.png')) {
    loadedSlides.value[index] = true
    return
  }

  target.src = '/img/no-image.png'
}

function onImageLoad(index: number) {
  loadedSlides.value[index] = true

  if (pendingIndex.value === index) {
    displayedIndex.value = index
    pendingIndex.value = null
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

  &__img {
    position: absolute;
    inset: 0;
    transition: opacity 0.2s ease;

    &--hidden {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__skeleton {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;

    :deep(.skeleton) {
      display: block;
      width: 100%;
      height: 100%;
    }

    :deep(.skeleton__image) {
      width: 100%;
      height: 100%;
      aspect-ratio: auto;
      border-radius: 4px;
    }
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
    z-index: 2;
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
