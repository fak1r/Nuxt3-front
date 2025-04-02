<template>
  <div class="producers">
    <h1 class="producers__title">Производитель: {{ producerName }}</h1>
    <ProductList :products="products" />
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/store/products'
import { useCategoriesStore } from '~/store/categories'

import ProductList from '~/components/Products/ProductList.vue'

definePageMeta({
  middleware: 'auth',
})

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const { fetchProducts } = productsStore
const { producers } = storeToRefs(categoriesStore)

const route = useRoute()
const producerId = computed(() => Number(route.params.id))
const producerName = computed(() => producers.value.find((p) => p.id === producerId.value)?.name)

const products = ref([])

onMounted(async function () {
  products.value = await fetchProducts({ producer_id: producerId.value })
})
</script>

<style scoped lang="scss">
.producers {
  &__title {
    margin-bottom: 16px;
    text-align: center;
  }
}
</style>
