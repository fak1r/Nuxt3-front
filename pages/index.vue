<template>
  <section class="main-page">
    <h1>Магазин напольных покрытий «Зам Пол»</h1>
    <MainPageHero />
    <h4>Популярные товары</h4>
    <ProductList class="main-page__products" :products="popularProducts" />
    <div class="main-page__catalog-btn">
      <TheButton variant="Filled" size="lg" @click="goToCatalog">Смотреть каталог</TheButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'
import ProductList from '~/components/Products/Products/ProductList.vue'
import MainPageHero from '~/components/MainPage/MainPageHero.vue'
import type { Product } from '~/types/products.types'
import TheButton from '~/components/UI/TheButton.vue'

const productsStore = useProductsStore()

const { fetchPopularProducts } = productsStore

const { data } = await useAsyncData<Product[]>('popular-products', () => fetchPopularProducts(), {
  server: true,
  lazy: false,
})

const popularProducts = data.value || []

function goToCatalog() {
  navigateTo('/catalog')
}
</script>

<style scoped lang="scss">
.main-page {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  align-items: center;
  box-sizing: border-box;

  h1 {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 34px;

    @include phone {
      font-size: 28px;
    }

    @media screen and (max-width: 560px) {
      font-size: 24px;
      text-align: center;
      margin-bottom: 8px;
    }
  }

  h4 {
    font-size: 28px;
    padding: 16px 0;

    @include phone {
      padding: 8px 0;
      font-size: 24px;
    }

    @media screen and (max-width: 500px) {
      padding: 4px 0;
      font-size: 18px;
    }
  }

  &__catalog-btn {
    margin: 16px 0;
  }
}
</style>
