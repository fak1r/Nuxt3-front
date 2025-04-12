import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { normalizeProducts } from '~/utils/normalize-products'
import { toQueryString } from '~/utils/to-query-string'
import type { ProductFilters } from '~/types/products.types'

export const useProductsStore = defineStore('products', () => {
  const productsAreLoading = ref(false)

  async function fetchProducts(filters: ProductFilters = {}) {
    productsAreLoading.value = true
    try {
      const { $axios } = useNuxtApp()
      const query = toQueryString(filters)
      const { data } = await $axios.get(`/products?${query}`)
      const normalized = normalizeProducts(data)

      return {
        products: normalized,
        page: filters.page || 1,
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров', error)
      return {
        products: [],
        page: filters.page || 1,
      }
    } finally {
      productsAreLoading.value = false
    }
  }

  return { fetchProducts, productsAreLoading }
})
