import { useRouter } from 'vue-router'
import { useIsMobile } from '~/composables/useIsMobile'
import { useProductsStore } from '~/store/products'
import type { ProductListState, ProductFilters, Product } from '~/types/products.types'

interface UseProductListPageOptions {
  titlePrefix: string
  title: Ref<string>
  filters: Ref<ProductFilters>
  slugListRef: Ref<{ slug: string }[]>
  slugToCheck: string
}

export function useProductListPage({
  titlePrefix,
  title,
  filters,
  slugListRef,
  slugToCheck,
}: UseProductListPageOptions) {
  const router = useRouter()
  const { isMobile } = useIsMobile()
  const limit = ref(30)

  const products = ref<Product[]>([])
  const page = ref(1)
  const hasMore = ref(true)
  const firstLoading = ref(true)
  const productsAreLoading = ref(false)

  const productsStore = useProductsStore()
  const { fetchProducts } = productsStore

  async function loadMoreProducts() {
    if (!hasMore.value || productsAreLoading.value) return

    productsAreLoading.value = true

    const currentFilters = {
      ...filters.value,
      page: page.value,
      limit: limit.value,
    }

    const { products: newProducts = [] } = await fetchProducts(currentFilters)

    if (newProducts.length < limit.value) {
      hasMore.value = false
    }

    products.value.push(...newProducts)
    page.value++
    firstLoading.value = false
    productsAreLoading.value = false
  }

  onMounted(() => {
    limit.value = isMobile.value ? 10 : 30
    loadMoreProducts()
  })

  const productPageState = computed<ProductListState>(() => ({
    title: title.value,
    titlePrefix,
    products: products.value,
    productsAreLoading: productsAreLoading.value,
    hasMore: hasMore.value,
    firstLoading: firstLoading.value,
  }))

  watchEffect(() => {
    if (Array.isArray(slugListRef.value) && slugListRef.value.length > 0) {
      const exists = slugListRef.value.some((el) => el.slug === slugToCheck)
      if (!exists) router.push('/404')
    }
  })

  return {
    productPageState,
    loadMoreProducts,
  }
}
