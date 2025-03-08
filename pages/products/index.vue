<template>
  <div class="products">
    <h1>Каталог товаров</h1>

    <!-- Фильтр по категории -->
    <label for="category">Категория:</label>
    <select id="category" v-model="selectedCategory" @change="fetchFilteredProducts">
      <option v-for="category in categoriesStore.categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>

    <!-- 🔹 Фильтр по подкатегории -->
    <label v-if="subcategories.length > 0" for="subcategory">Подкатегория:</label>
    <select
      v-if="subcategories.length > 0"
      id="subcategory"
      v-model="selectedSubcategory"
      @change="fetchFilteredProducts"
    >
      <option :value="null">Все подкатегории</option>
      <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
        {{ subcategory.name }}
      </option>
    </select>

    <!-- Сортировка -->
    <label for="sort">Сортировка:</label>
    <select id="sort" v-model="selectedSort" @change="fetchFilteredProducts">
      <option value="price-asc">Цена: по возрастанию</option>
      <option value="price-desc">Цена: по убыванию</option>
      <option value="name-asc">Название: А-Я</option>
      <option value="name-desc">Название: Я-А</option>
    </select>

    <!-- Список товаров -->
    <div v-if="productsStore.loading">Загрузка...</div>
    <div v-else-if="productsStore.products.length === 0">Нет товаров</div>

    <ul v-else class="product-list">
      <li v-for="product in productsStore.products" :key="product.id">
        <ProductCard :product="product" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useProductsStore } from '@/store/products'
import { useCategoriesStore } from '@/store/categories'
import ProductCard from '@/components/ProductCard.vue'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const selectedCategory = ref(null)
const selectedSubcategory = ref(null)
const selectedSort = ref('price-asc')

const categories = ref([])
const subcategories = ref([])

onMounted(async () => {
  await categoriesStore.init()
  categories.value = categoriesStore.categories
  subcategories.value = categoriesStore.subcategories
  productsStore.fetchProducts()
})

watch(selectedCategory, (newCategory) => {
  selectedSubcategory.value = null
  subcategories.value = categoriesStore.subcategories.filter((sc) => sc.category_id === newCategory)
})

function fetchFilteredProducts() {
  const [sort_by, order] = selectedSort.value.split('-')

  // Собираем фильтры
  const filters = { sort_by, order }

  // ✅ Добавляем category_id ТОЛЬКО если категория выбрана
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
  max-width: var(--max-page-width);
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  align-items: center;

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    list-style: none;
    padding: 20px;
  }
}
</style>
