import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { normalizeProducts } from '~/utils/normalize-products'
import { toQueryString } from '~/utils/to-query-string'
import type { ProductFilters } from '~/types/products.types'

export const useProductsStore = defineStore('products', () => {
  const { $axios } = useNuxtApp()
  const productsAreLoading = ref(false)

  async function fetchProducts(filters: ProductFilters = {}) {
    productsAreLoading.value = true
    try {
      const { category_slug, producer_slug, ...queryFilters } = filters

      let endpoint = '/products'

      if (category_slug) {
        endpoint += `/${category_slug}`
        if (producer_slug) {
          endpoint += `/${producer_slug}`
        }
      }

      const query = toQueryString(queryFilters)
      const { data } = await $axios.get(`${endpoint}?${query}`)
      const normalized = normalizeProducts(data.items)

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

  async function fetchProduct({
    category_slug,
    producer_slug,
    product_slug,
  }: {
    category_slug: string
    producer_slug: string
    product_slug: string
  }) {
    try {
      const { data } = await $axios.get(`/products/${category_slug}/${producer_slug}/${product_slug}`)
      return data
    } catch (error) {
      console.error('Ошибка загрузки товара', error)
      return null
    }
  }

  async function fetchPopularProducts() {
    const { data } = await $axios.get('/products/popular')
    const normalized = normalizeProducts(data.items)

    return normalized
  }

  return { fetchProducts, fetchProduct, fetchPopularProducts, productsAreLoading }
})
