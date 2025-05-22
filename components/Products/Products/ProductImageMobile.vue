<template>
  <div class="image-wrap">
    <swiper
      :modules="[Pagination]"
      class="image-swiper"
      :pagination="{
        el: '.image-swiper__pagination',
        clickable: true,
      }"
    >
      <div class="image-swiper__pagination" :style="{ opacity: hasImgs ? 1 : 0 }" />

      <swiper-slide v-for="(img, index) in product.img_mini" :key="index">
        <ImgSkeleton v-if="!isImgLoaded" />
        <img
          v-show="isImgLoaded"
          :src="img"
          loading="lazy"
          :alt="`${product.name} – миниатюра ${index + 1}`"
          @error="onImgError"
          @load="onImageLoad"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import type { Product } from '~/types/products.types'
import ImgSkeleton from '~/components/Products/ImgSkeleton.vue'

interface Props {
  product: Product
}

const { product } = defineProps<Props>()

const hasImgs = computed(() => product.img_mini.length > 1)
const isImgLoaded = ref(true)

function onImgError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/img/no-image.png'
}

function onImageLoad() {
  isImgLoaded.value = true
}
</script>

<style scoped lang="scss">
.image-wrap {
  .image-swiper {
    position: relative;
    border-radius: 4px;
    aspect-ratio: 4 / 3;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
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
