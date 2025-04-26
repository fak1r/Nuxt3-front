<template>
  <section class="product-page">
    <TheLoader v-if="!product" size="xl" class="product-page__loader" />

    <ProductView v-else :product="product" />
  </section>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'
import ProductView from '~/components/Products/Product/ProductView.vue'
import TheLoader from '~/components/UI/TheLoader.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { fetchProduct } = useProductsStore()

const product = ref<any | null>(null)

onMounted(async () => {
  const category = route.params.category as string
  const producer = route.params.producer as string
  const slug = route.params.product as string

  product.value = await fetchProduct({
    category_slug: category,
    producer_slug: producer,
    product_slug: slug,
  })
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
</style>
