import { useRouter } from 'vue-router'
import type { ProductListState, ProductFilters, PaginatedProducts } from '~/types/products.types'
import { normalizeProducts } from '~/utils/normalize-products'

interface UseProductListPageOptions {
  titlePrefix: string
  title: Ref<string>
  filters: Ref<ProductFilters>
  ssrProducts?: PaginatedProducts | null
  slugListRef: Ref<{ slug: string }[]>
  slugToCheck: string
}

export function useProductListPage({
  titlePrefix,
  title,
  filters,
  ssrProducts,
  slugListRef,
  slugToCheck,
}: UseProductListPageOptions) {
  const router = useRouter()

  const { products, loadMoreProducts, productsAreLoading, hasMore, firstLoading } = useInfiniteProducts(
    filters,
    ssrProducts?.items ?? [],
  )

  if (ssrProducts?.items?.length) {
    ssrProducts.items = normalizeProducts(ssrProducts.items)
  }

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
