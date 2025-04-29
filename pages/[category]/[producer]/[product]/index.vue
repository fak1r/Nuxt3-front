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
import { useProductsStore } from '~/store/products'
import ProductView from '~/components/Products/Product/ProductView.vue'
import TheLoader from '~/components/UI/TheLoader.vue'
import TheLinkButton from '~/components/UI/TheLinkButton.vue'

const route = useRoute()
const { fetchProduct } = useProductsStore()

const product = ref<any | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  const category = route.params.category as string
  const producer = route.params.producer as string
  const slug = route.params.product as string

  try {
    product.value = await fetchProduct({
      category_slug: category,
      producer_slug: producer,
      product_slug: slug,
    })
  } catch (error) {
    console.error('Ошибка загрузки продукта:', error)
  } finally {
    isLoading.value = false
  }
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
