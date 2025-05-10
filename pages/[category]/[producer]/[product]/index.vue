<template>
  <section class="product-page">
    <TheLoader v-if="isLoading" size="xl" class="product-page__loader" />

    <ProductView v-else-if="product" :product="product" />

    <div v-else class="not-found">
      <h1 class="not-found__title">Товар не найден</h1>
      <p class="not-found__text">К сожалению, запрашиваемый товар отсутствует.</p>
      <TheLinkButton to="/">Вернуться на главную</TheLinkButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from '~/types/products.types'
import ProductView from '~/components/Products/Product/ProductView.vue'
import TheLoader from '~/components/UI/TheLoader.vue'
import TheLinkButton from '~/components/UI/TheLinkButton.vue'

definePageMeta({
  payload: true,
})

const route = useRoute()
const config = useRuntimeConfig()

const pathParts = route.path.split('/').filter(Boolean)
const category = pathParts[0]
const producer = pathParts[1]
const slug = pathParts[2]

const {
  data: product,
  status,
  error,
} = await useAsyncData<Product>(`product-${category}-${producer}-${slug}`, () =>
  $fetch(`/products/${category}/${producer}/${slug}`, {
    baseURL: config.public.apiBaseUrl,
  }),
)

const isLoading = computed(() => status.value === 'pending')

if (error.value && !import.meta.server) {
  throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
}

const defaultImage = `${config.public.siteUrl}/static/og-image.png`

useHead({
  title: product.value?.full_name,
  meta: [
    { name: 'description', content: `Цена ${product.value?.price} ₽. Ламинат, паркет, напольные покрытия.` },
    { property: 'og:title', content: product.value?.name },
    { property: 'og:image', content: product.value?.img_mini?.[0] || defaultImage },
  ],
})
</script>

<style scoped lang="scss">
.product-page {
  &__loader {
    display: flex;
    justify-content: center;
    padding: 64px 0;
  }
}
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
