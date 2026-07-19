import { useRouter, useRoute } from 'vue-router'
import { useIsMobile } from '~/composables/useIsMobile'
import { useProductsStore } from '~/store/products'
import type { ProductListState, ProductFilters, Product } from '~/types/products.types'
import { normalizeInternalPath } from '~/utils/get-safe-route-redirect'

interface UseProductListPageOptions {
  titlePrefix: string
  title: Ref<string>
  filters: Ref<ProductFilters>
  slugListRef: Ref<{ slug: string }[]>
  slugToCheck: string
  initialProducts?: Product[]
  initialLimit?: number
}

export function useProductListPage({
  titlePrefix,
  title,
  filters,
  slugListRef,
  slugToCheck,
  initialProducts = [],
  initialLimit = 30,
}: UseProductListPageOptions) {
  const router = useRouter()
  const route = useRoute()
  const { isMobile } = useIsMobile()
  const limit = ref(initialLimit)

  const products = ref<Product[]>([...initialProducts])
  const page = ref(initialProducts.length > 0 ? Math.floor(initialProducts.length / initialLimit) + 1 : 1)
  const hasMore = ref(initialProducts.length >= initialLimit)
  const firstLoading = ref(initialProducts.length === 0)
  const productsAreLoading = ref(false)

  const productsStore = useProductsStore()
  const { fetchProducts } = productsStore

  // Читаем сортировку из URL при первой загрузке
  const sortQuery = route.query.sort as string | undefined
  if (sortQuery) {
    const [sort_by, order] = sortQuery.split('_')
    if ((sort_by === 'price' || sort_by === 'name') && (order === 'asc' || order === 'desc')) {
      filters.value.sort_by = sort_by
      filters.value.order = order
    }
  }

  const productPageState = computed<ProductListState>(() => ({
    title: title.value,
    titlePrefix,
    products: products.value,
    productsAreLoading: productsAreLoading.value,
    hasMore: hasMore.value,
    firstLoading: firstLoading.value,
    order: filters.value.order,
  }))

  // Обновляем URL при изменении сортировки
  watch(
    () => `${filters.value.sort_by}_${filters.value.order}`,
    (sortString) => {
      router.replace({
        query: {
          ...route.query,
          sort: sortString,
        },
      })
    },
  )

  // Автоматически сбрасываем и перезапрашиваем продукты при смене сортировки
  watch(
    () => [filters.value.sort_by, filters.value.order],
    () => {
      resetProducts()
      loadMoreProducts()
    },
  )

  // Проверяем наличие slug-а в списке — если не найден, отправляем на 404
  watchEffect(() => {
    if (Array.isArray(slugListRef.value) && slugListRef.value.length > 0) {
      const exists = slugListRef.value.some((el) => el.slug === slugToCheck)
      if (!exists) router.push(normalizeInternalPath('/404'))
    }
  })

  onMounted(() => {
    const resolvedLimit = isMobile.value ? 10 : initialLimit

    if (limit.value !== resolvedLimit) {
      limit.value = resolvedLimit

      if (products.value.length > 0) {
        page.value = Math.floor(products.value.length / limit.value) + 1
      }
    }

    if (products.value.length === 0) {
      loadMoreProducts()
    }
  })

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

  function resetProducts() {
    products.value = []
    page.value = 1
    hasMore.value = true
    firstLoading.value = true
  }

  return {
    productPageState,
    loadMoreProducts,
    resetProducts,
  }
}
