<template>
  <ProductListPage :title="title" :filters="filters" title-prefix="Производитель" />
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/store/categories'
import type { ProductFilters } from '~/types/products.types'
import ProductListPage from '~/components/Products/Products/ProductListPage.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const categorySlug = route.params.category as string
const producerSlug = route.params.producer as string

const filters = ref<ProductFilters>({
  category_slug: categorySlug,
  producer_slug: producerSlug,
  sort_by: 'price',
  order: 'asc',
})

const { producers } = storeToRefs(useCategoriesStore())
const title = computed(() => producers.value.find((p) => p.slug === producerSlug)?.name || '')
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
