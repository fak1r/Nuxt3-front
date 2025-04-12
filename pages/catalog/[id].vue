<template>
  <ProductListPage :title="title" :filters="filters" title-prefix="Категория" />
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/store/categories'
import ProductListPage from '~/components/Products/ProductListPage.vue'
import type { ProductFilters } from '~/types/products.types'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const categoryId = computed(() => Number(route.params.id))

const filters = ref<ProductFilters>({
  category_id: categoryId.value,
  sort_by: 'price',
  order: 'asc',
})

const { categories } = storeToRefs(useCategoriesStore())
const title = computed(() => categories.value.find((c) => c.id === categoryId.value)?.name || '')
</script>

<style scoped lang="scss">
.categories {
  &__title {
    margin-bottom: 16px;
    text-align: center;
  }

  &__loader {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>
