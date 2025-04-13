<template>
  <div class="catalog">
    <h1 class="catalog__title">Каталог</h1>
    <div class="catalog__cards">
      <ul class="catalog__list">
        <li v-for="category in categoriesStore.categories" :key="category.id" class="catalog__item">
          <NuxtLink
            :to="`/catalog/${category.id}`"
            class="catalog__link"
            :aria-label="`Перейти в категорию ${category.name}`"
          >
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
import { useCategoriesStore } from '~/store/categories'
import laminatImg from '~/assets/img/laminat.png'
import ParketImg from '~/assets/img/parket.png'
import ImgSkeleton from '~/components/Products/ImgSkeleton.vue'

const categoriesStore = useCategoriesStore()

const imgs = [laminatImg, ParketImg]

const loading = ref<boolean[]>([])

watch(
  () => categoriesStore.categories,
  (newVal) => {
    loading.value = new Array(newVal.length).fill(true)
  },
  { immediate: true },
)

function onImageLoad(id: number) {
  loading.value[id - 1] = false
}

function isImgLoaded(id: number): boolean {
  return !loading.value[id - 1]
}
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
