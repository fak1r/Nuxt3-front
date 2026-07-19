<template>
  <div class="catalog">
    <h1 class="catalog__title">Каталог</h1>
    <div class="catalog__cards">
      <ul class="catalog__list">
        <li v-for="category in categories" :key="category.id" class="catalog__item">
          <NuxtLink :to="normalizeInternalPath(`/${category.slug}`)" class="catalog__link" :aria-label="`Перейти в категорию ${category.name}`">
            <ImgSkeleton v-if="!isImgLoaded(category.id)" />
            <img
              v-show="isImgLoaded(category.id)"
              :src="imgs[category.id - 1]"
              :alt="category.name"
              @load="onImageLoad(category.id)"
            />
            <h2 class="catalog__category">
              {{ category.name }}
            </h2>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import LinoleumImg from '~/assets/img/linoleum.png'
import LaminatImg from '~/assets/img/laminat.png'
import ParketImg from '~/assets/img/parket.png'
import ImgSkeleton from '~/components/Products/ImgSkeleton.vue'
import type { Category } from '~/types/categories.types'
import { fetchCatalogCategories } from '~/utils/catalog-api'
import { normalizeInternalPath } from '~/utils/get-safe-route-redirect'

const config = useRuntimeConfig()
const { data: categoriesData } = await useAsyncData('catalog-categories', () =>
  fetchCatalogCategories(config.public.apiBaseUrl),
)

const categories = computed(() => (categoriesData.value ?? []) as Category[])
const imgs = [LaminatImg, LinoleumImg, ParketImg]
const imageLoadingStatus = ref<boolean[]>([])

watch(
  categories,
  (newCategories) => {
    imageLoadingStatus.value = newCategories.map(() => true)
  },
  { immediate: true },
)

function onImageLoad(id: number) {
  imageLoadingStatus.value[id - 1] = false
}

function isImgLoaded(id: number): boolean {
  return !imageLoadingStatus.value[id - 1]
}

useHead({
  title: 'Каталог | Зам Пол',
  meta: [
    {
      name: 'description',
      content: 'Каталог магазина Зам Пол: ламинат, линолеум и паркет в наличии и под заказ в Коломне.',
    },
    {
      property: 'og:title',
      content: 'Каталог | Зам Пол',
    },
    {
      property: 'og:description',
      content: 'Каталог магазина Зам Пол: ламинат, линолеум и паркет в наличии и под заказ в Коломне.',
    },
  ],
})
</script>

<style scoped lang="scss">
.catalog {
  &__title {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 16px;
  }

  &__cards {
    display: flex;
    justify-content: center;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 8px;
    width: 100%;
    max-width: 600px;
  }

  &__item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  &__link {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
  }
}
</style>
