<template>
  <div class="image-slider">
    <swiper
      ref="swiperRef"
      :modules="[Pagination]"
      class="image-slider__swiper"
      :pagination="{
        el: '.image-slider__pagination',
        clickable: true,
      }"
    >
      <div class="image-slider__pagination" :style="{ opacity: hasImgs ? 1 : 0 }" />

      <swiper-slide v-for="(img, index) in images" :key="index">
        <ImgSkeleton v-if="!isImgLoaded" />
        <img v-show="isImgLoaded" :src="img.image_url" alt="Фото товара" @error="onImgError" @load="onImageLoad" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import ImgSkeleton from '~/components/Products/ImgSkeleton.vue'

interface Props {
  images: {
    id: number
    image_url: string
  }[]
}

const { images } = defineProps<Props>()

const isImgLoaded = ref(false)
const swiperRef = ref<any>(null)

const hasImgs = computed(() => images.length > 1)

function onImageLoad() {
  isImgLoaded.value = true
}

function onImgError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/img/no-image.png'
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  swiperRef.value?.update?.()
}
</script>

<style scoped lang="scss">
.image-slider {
  position: relative;

  &__swiper {
    aspect-ratio: 4 / 3;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
    z-index: 10;
  }
}

:deep(.swiper-pagination-bullet) {
  flex: 1;

  &.swiper-pagination-bullet-active {
    background: #000;
  }
}
</style>
