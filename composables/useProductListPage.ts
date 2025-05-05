import { useRoute, useRouter } from 'vue-router'
import type { ProductListState, ProductFilters, PaginatedProducts } from '~/types/products.types'

interface UseProductListPageOptions {
  titlePrefix: string
  getTitleBySlug: (slug: string) => string | undefined
  validateSlugExists: () => boolean
  filters: Ref<ProductFilters>
  ssrProducts?: PaginatedProducts | null
}

export function useProductListPage({
  titlePrefix,
  getTitleBySlug,
  validateSlugExists,
  filters,
  ssrProducts,
}: UseProductListPageOptions) {
  const route = useRoute()
  const router = useRouter()

  const title = computed(
    () => getTitleBySlug((route.params.producer as string) || (route.params.category as string)) || '',
  )

  const { products, loadMoreProducts, productsAreLoading, hasMore, firstLoading } = useInfiniteProducts(filters)

  const hasSSR = !!ssrProducts?.items?.length

  const productPageState = computed<ProductListState>(() => ({
    title: title.value,
    titlePrefix,
    products: hasSSR ? ssrProducts.items : products.value,
    productsAreLoading: productsAreLoading.value,
    hasMore: hasSSR ? false : hasMore.value,
    firstLoading: firstLoading.value,
  }))

  watch(
    validateSlugExists,
    (exists) => {
      if (!exists) router.push('/404')
    },
    { immediate: true },
  )

  onMounted(() => {
    if (!hasSSR) {
      loadMoreProducts()
    }
  })

  return {
    productPageState,
    loadMoreProducts,
  }
}
