<template>
  <section class="not-found">
    <h1 class="not-found__title">404 — Страница не найдена</h1>
    <p class="not-found__text">К сожалению, запрашиваемая страница не существует.</p>
    <TheLinkButton to="/">Вернуться на главную</TheLinkButton>
  </section>
</template>

<script setup lang="ts">
import TheLinkButton from '~/components/UI/TheLinkButton.vue'
</script>

<style lang="scss" scoped>
.not-found {
  text-align: center;
  padding: 60px 20px;

  &__title {
    font-size: 32px;
    margin-bottom: 16px;
  }

  &__text {
    margin-bottom: 32px;
  }
}
</style>
