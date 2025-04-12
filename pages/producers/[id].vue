<template>
  <ProductListPage :title="title" :filters="filters" title-prefix="Производитель" />
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/store/categories'
import ProductListPage from '~/components/Products/ProductListPage.vue'
import type { ProductFilters } from '~/types/products.types'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const producerId = computed(() => Number(route.params.id))
const filters = ref<ProductFilters>({
  producer_id: producerId.value,
  sort_by: 'price',
  order: 'asc',
})

const { producers } = storeToRefs(useCategoriesStore())
const title = computed(() => producers.value.find((p) => p.id === producerId.value)?.name || '')
</script>

<style scoped lang="scss">
.producers {
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
