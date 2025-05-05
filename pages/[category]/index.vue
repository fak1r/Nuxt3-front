<template>
  <ProductListPage :state="productPageState" @load-more="loadMoreProducts" />
</template>

<script setup lang="ts">
import type { ProductFilters } from '~/types/products.types'
import { useCategoriesStore } from '~/store/categories'
import ProductListPage from '~/components/Products/Products/ProductListPage.vue'

const route = useRoute()
const categorySlug = route.params.category as string

const filters = ref<ProductFilters>({
  category_slug: categorySlug,
  sort_by: 'price',
  order: 'asc',
})

const { categories } = storeToRefs(useCategoriesStore())

const { productPageState, loadMoreProducts } = useProductListPage({
  titlePrefix: 'Категория',
  getTitleBySlug: (slug) => categories.value.find((c) => c.slug === slug)?.name,
  validateSlugExists: () => !!categories.value.find((c) => c.slug === categorySlug),
  filters,
})
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
