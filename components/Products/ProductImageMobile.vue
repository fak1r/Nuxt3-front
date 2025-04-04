<template>
  <swiper
    :modules="[Pagination]"
    class="product-image-mobile"
    :pagination="{
      el: '.custom-pagination',
      clickable: true,
    }"
  >
    <swiper-slide v-for="(img, index) in product.images" :key="index">
      <img :src="img.image_url" alt="Фото товара" />
    </swiper-slide>
    <div v-if="hasImgs" class="custom-pagination" />
  </swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import type { Product } from '~/types/products.types'

interface Props {
  product: Product
}

const { product } = defineProps<Props>()

const hasImgs = computed(() => product.images.length > 1)

onMounted(() => {
  console.log(hasImgs.value)
  console.log(product.images)
})

const swiperRef = ref<any>(null)

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  swiperRef.value?.update()
}
</script>

<style scoped lang="scss">
.product-image-mobile {
  border-radius: 4px;

  img {
    width: 100%;
    height: 230px;
    object-fit: cover;
  }

  .custom-pagination {
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
