import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import type { ProductSearchItem } from '~/types/products.types'

const query = ref('')
const searchResults = ref<ProductSearchItem[]>([])
const isLoading = ref(false)
const isSearchResOpen = ref(false)

let initialized = false

export function useProductSearch(
  initQuery?: Ref<string>,
  options: {
    limit?: number
    minLength?: number
    debounceMs?: number
  } = {},
) {
  const { $axios } = useNuxtApp()
  const { limit = 10, minLength = 2, debounceMs = 300 } = options

  if (initQuery && !initialized) {
    const fetchResults = debounce(async (q: string) => {
      if (q.length < minLength) {
        searchResults.value = []
        isSearchResOpen.value = false
        return
      }

      isLoading.value = true

      try {
        const { data } = await $axios.get('/products/search', {
          params: {
            query: q,
            limit,
          },
        })

        searchResults.value = data
        isSearchResOpen.value = data.length > 0
      } catch (error) {
        console.error('Ошибка поиска продуктов:', error)
        searchResults.value = []
        isSearchResOpen.value = false
      } finally {
        isLoading.value = false
      }
    }, debounceMs)

    watch(initQuery, (val) => {
      query.value = val.trim()
      fetchResults(val.trim())
    })

    initialized = true
  }

  return {
    query,
    searchResults,
    isLoading,
    isSearchResOpen,
    closeSearchRes: () => (isSearchResOpen.value = false),
    openSearchRes: () => (isSearchResOpen.value = true),
  }
}
