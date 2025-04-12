<template>
  <div class="products">
    <h1 class="producers__title">Все товары</h1>

    <label for="sort">Сортировка:</label>
    <select id="sort" v-model="selectedSort" @change="fetchFilteredProducts">
      <option value="price-asc">Цена: по возрастанию</option>
      <option value="price-desc">Цена: по убыванию</option>
      <option value="name-asc">Название: А-Я</option>
      <option value="name-desc">Название: Я-А</option>
    </select>

    <ProducList :products="products" />
  </div>
</template>

<script setup>
import { useProductsStore } from '@/store/products'
import ProducList from '~/components/Products/ProductList.vue'

definePageMeta({
  middleware: 'auth',
})

const productsStore = useProductsStore()

const selectedSort = ref('price-asc')
const products = ref([])

// onMounted(async () => {
//   products.value = await productsStore.fetchProducts()
// })

function fetchFilteredProducts() {
  const [sort_by, order] = selectedSort.value.split('-')

  const filters = { sort_by, order }

  if (selectedCategory.value !== null) {
    filters.category_id = selectedCategory.value
  }

  if (selectedSubcategory.value !== null) {
    filters.subcategory_id = selectedSubcategory.value
  }

  productsStore.fetchProducts(filters)
}
</script>

<style scoped lang="scss">
.products {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: var(--main-padding);
  box-sizing: border-box;
}
</style>
