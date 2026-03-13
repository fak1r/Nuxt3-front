<template>
  <div class="image-wrap">
    <swiper
      v-if="hasImgs"
      :modules="[Pagination]"
      class="image-swiper"
      :preload-images="false"
      :lazy-preload-prev-next="1"
      :pagination="{
        el: '.image-swiper__pagination',
        clickable: true,
      }"
      @slide-change="onSlideChange"
    >
      <div class="image-swiper__pagination" :style="{ opacity: hasImgs ? 1 : 0 }" />

      <swiper-slide v-for="(img, index) in product.img_mini" :key="index">
        <div class="image-media">
          <ImgSkeleton v-if="!isSlideLoaded(index)" class="image-media__skeleton" />
          <img
            v-if="isSlideRequested(index)"
            :class="['image-media__img', { 'image-media__img--hidden': !isSlideLoaded(index) }]"
            :src="img"
            :loading="index === 0 ? 'eager' : 'lazy'"
            decoding="async"
            :alt="`${product.name} - миниатюра ${index + 1}`"
            @error="onImgError(index, $event)"
            @load="onImageLoad(index)"
          />
        </div>
      </swiper-slide>
    </swiper>

    <div v-else class="image-single image-media">
      <ImgSkeleton v-if="!isSlideLoaded(0)" class="image-media__skeleton" />
      <img
        :class="['image-media__img', { 'image-media__img--hidden': !isSlideLoaded(0) }]"
        :src="firstImage"
        loading="eager"
        decoding="async"
        :alt="`${product.name} - миниатюра 1`"
        @error="onImgError(0, $event)"
        @load="onImageLoad(0)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import type { Product } from '~/types/products.types'
import ImgSkeleton from '~/components/Products/ImgSkeleton.vue'

interface Props {
  product: Product
}

const { product } = defineProps<Props>()

const hasImgs = computed(() => product.img_mini.length > 1)
const firstImage = computed(() => product.img_mini[0] || '/img/no-image.png')
const requestedSlides = ref<Record<number, boolean>>({})
const loadedSlides = ref<Record<number, boolean>>({})

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

function resetSlidesState() {
  requestedSlides.value = {}
  loadedSlides.value = {}
  requestAround(0)
}

function isSlideRequested(index: number) {
  return !!requestedSlides.value[index]
}

function isSlideLoaded(index: number) {
  return !!loadedSlides.value[index]
}

function onSlideChange(swiper: SwiperInstance) {
  requestAround(swiper.activeIndex)
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
}

watch(
  () => product.img_mini,
  () => {
    resetSlidesState()
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.image-wrap {
  .image-single,
  .image-swiper {
    position: relative;
    border-radius: 4px;
    aspect-ratio: 4 / 3;
    overflow: hidden;
  }

  .image-media {
    width: 100%;
    height: 100%;
    position: relative;

    &__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
      transition: opacity 0.2s ease;

      &--hidden {
        opacity: 0;
      }
    }

    &__skeleton {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
    }
  }

  .image-swiper {
    &__pagination {
      display: flex;
      width: 100%;
      height: 2px;
      background-color: #d6d6db;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
    }
  }
}

:deep(.swiper-pagination-bullet) {
  flex: 1;

  &.swiper-pagination-bullet-active {
    background: #000;
  }
}
</style>
