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

  const isServerPrerender = import.meta.env.SSR && import.meta.server

  async function loadMoreProducts() {
    if (!hasMore.value) return

    const currentFilters = {
      ...filters,
      page: page.value,
      limit: isServerPrerender ? 9999 : limit,
    }

    const { products: newProducts = [] } = await fetchProducts(currentFilters)

    if (newProducts.length < (isServerPrerender ? 9999 : limit)) {
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
