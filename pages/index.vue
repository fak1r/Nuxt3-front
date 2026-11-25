<template>
  <section class="main-page">
    <h1>Напольные покрытия в Коломне</h1>
    <MainPageHero />
    <MainPagePromo />
    <MainPageCategories />
    <MainPageLocalSeo />
  </section>
</template>

<script setup lang="ts">
import MainPageHero from '~/components/MainPage/MainPageHero.vue'
import MainPagePromo from '~/components/MainPage/MainPagePromo.vue'
import MainPageCategories from '~/components/MainPage/MainPageCategories.vue'
import MainPageLocalSeo from '~/components/MainPage/MainPageLocalSeo.vue'
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

}
</style>
