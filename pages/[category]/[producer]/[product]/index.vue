<template>
  <section class="product-page">
    <TheBreadcrumbs v-if="product" :breadcrumbs="product.breadcrumbs" />
    <ProductView v-if="product" :product="product" />
  </section>
</template>

<script setup lang="ts">
import type { Product } from '~/types/products.types'
import ProductView from '~/components/Products/Product/ProductView.vue'
import TheBreadcrumbs from '~/components/UI/TheBreadcrumbs.vue'

definePageMeta({
  payload: true,
})

const route = useRoute()
const config = useRuntimeConfig()

const pathParts = route.path.split('/').filter(Boolean)
const category = pathParts[0]
const producer = pathParts[1]
const slug = pathParts[2]

const { data: product, error } = await useAsyncData<Product>(`product-${category}-${producer}-${slug}`, () =>
  $fetch(`/products/${category}/${producer}/${slug}`, {
    baseURL: config.public.apiBaseUrl,
  }),
)

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
