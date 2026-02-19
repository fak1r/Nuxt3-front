<template>
  <div class="main-page-hero">
    
    <div class="main-page-hero__image-wrapper">
      <img class="main-page-hero__image" :src="MainPageImg" alt="Качественный паркет" />
      <div class="main-page-hero__content">
        <h2 class="main-page-hero__title">Ламинат и Паркет</h2>
        <h3 class="main-page-hero__description">Большой выбор качественных напольных покрытий</h3>
      </div>
    </div>

    <img class="main-page-hero__grass" :src="GrassImg" alt="" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import MainPageImg from '~/assets/img/hero-block.webp'
import GrassImg from '~/assets/img/grass.webp'
</script>

<style scoped lang="scss">
.main-page-hero {
  width: 100%;
  height: 100%;

  &__image-wrapper {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
  }

  &__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__grass {
    position: absolute;
    top: 100px;
    right: 0;
    pointer-events: none;

    @media screen and (max-width: 1790px) {
      display: none;
    }
  }

  &__content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;
    z-index: 2;
    padding: 48px;
    text-shadow:
      0 2px 8px rgba(0, 0, 0, 0.45),
      0 12px 24px rgba(0, 0, 0, 0.25);

    @include tablet {
      padding: 36px;
      gap: 8px;
    }

    @include phone {
      padding: 14px;
      gap: 6px;
    }

    @media screen and (max-width: 570px) {
      gap: 0;
    }

  }

  &__title {
    color: var(--white-color);
    font-size: 64px;

    @include tablet {
      font-size: 44px;
    }

    @include phone {
      font-size: 34px;
    }

    @media screen and (max-width: 500px) {
      font-size: 28px;
    }
  }

  &__description {
    color: var(--white-color);
    font-size: 32px;
    max-width: 40%;
    font-weight: 300;

    @include tablet {
      font-size: 22px;
    }

    @include phone {
      font-size: 20px;
      max-width: 50%;
    }

    @media screen and (max-width: 570px) {
      max-width: 60%;
    }

    @media screen and (max-width: 500px) {
      font-size: 16px;
    }

    @media screen and (max-width: 400px) {
      max-width: 80%;
    }
  }
}
</style>
