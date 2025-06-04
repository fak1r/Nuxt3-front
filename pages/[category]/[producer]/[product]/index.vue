<template>
  <section class="product-page">
    <TheBreadcrumbs v-if="product" :breadcrumbs="product.breadcrumbs" />
    <ProductView v-if="product" :product="product" />

    <h2 v-if="relatedProducts">Товары из коллекции {{ collectionName }}</h2>
    <ProductList v-if="relatedProducts" :products="relatedProducts" />
  </section>
</template>

<script setup lang="ts">
import type { Product, RelatedProductsResponse } from '~/types/products.types'
import ProductView from '~/components/Products/Product/ProductView.vue'
import TheBreadcrumbs from '~/components/UI/TheBreadcrumbs.vue'
import ProductList from '~/components/Products/Products/ProductList.vue'

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

const { data: related } = await useAsyncData<RelatedProductsResponse>(`related-${category}-${producer}-${slug}`, () =>
  $fetch(`/products/${category}/${producer}/${slug}/related`, {
    baseURL: config.public.apiBaseUrl,
  }),
)

const relatedProducts = computed(() => related.value?.items || [])
const collectionName = computed(() => related.value?.collection_name || '')

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
  display: flex;
  flex-direction: column;
  gap: 16px;

  @include phone {
    gap: 8px;
  }
}
</style>
