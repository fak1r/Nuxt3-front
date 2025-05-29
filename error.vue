<template>
  <NuxtLayout>
    <section class="error-page">
      <h1 class="error-page__title">{{ error.statusCode }} — {{ error.statusMessage || 'Произошла ошибка' }}</h1>
      <p class="error-page__text">К сожалению, запрашиваемая страница не существует.</p>
      <TheLinkButton to="/">Вернуться на главную</TheLinkButton>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import TheLinkButton from '~/components/UI/TheLinkButton.vue'

const { error } = defineProps<{ error: NuxtError }>()

useHead({
  title: `${error.statusCode} — ${error.statusMessage || 'Ошибка'}`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'description', content: 'Произошла ошибка при загрузке страницы.' },
  ],
})
</script>

<style lang="scss" scoped>
.error-page {
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
