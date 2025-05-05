import type { Product, ProductFilters } from '~/types/products.types'
import { useProductsStore } from '~/store/products'

export function useInfiniteProducts(filters: Ref<ProductFilters>) {
  const products = ref<Product[]>([])
  const page = ref(1)
  const limit = 30
  const hasMore = ref(true)
  const firstLoading = ref(true)

  const productsStore = useProductsStore()
  const { fetchProducts } = productsStore
  const { productsAreLoading } = storeToRefs(productsStore)

  async function loadMoreProducts() {
    if (!hasMore.value) return

    const currentFilters = {
      ...filters.value,
      page: page.value,
      limit: limit,
    }

    const { products: newProducts = [] } = await fetchProducts(currentFilters)

    if (newProducts.length < limit) {
      hasMore.value = false
    }

    products.value.push(...newProducts)
    page.value++
  }

  if (firstLoading.value) {
    firstLoading.value = false
  }

  return {
    products,
    loadMoreProducts,
    productsAreLoading,
    hasMore,
    firstLoading,
  }
}
