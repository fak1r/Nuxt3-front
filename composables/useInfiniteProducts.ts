import type { Product, ProductFilters } from '~/types/products.types'
import { useProductsStore } from '~/store/products'

export function useInfiniteProducts(filters: Ref<ProductFilters>) {
  const products = ref<Product[]>([])
  const page = ref(1)
  const perPage = 20
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
      per_page: perPage,
    }

    const { products: newProducts = [] } = await fetchProducts(currentFilters)

    if (newProducts.length < perPage) {
      hasMore.value = false
    }

    products.value.push(...newProducts)
    page.value++
  }

  return {
    products,
    loadMoreProducts,
    productsAreLoading,
    hasMore,
    firstLoading,
  }
}
