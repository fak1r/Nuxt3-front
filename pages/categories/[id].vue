<template>
  <div class="categories">
    <h1 class="categories__title">Категория: {{ categoryName }}</h1>
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
const { categories } = storeToRefs(categoriesStore)

const route = useRoute()
const categoryId = computed(() => Number(route.params.id))
const categoryName = computed(() => categories.value.find((c) => c.id === categoryId.value)?.name)

const products = ref([])

onMounted(async function () {
  products.value = await fetchProducts({ category_id: categoryId.value })
})
</script>

<style scoped lang="scss">
.categories {
  &__title {
    margin-bottom: 16px;
    text-align: center;
  }
}
</style>
