import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { normalizeProducts } from '~/utils/normalize-products'

export const useProductsStore = defineStore('products', () => {
  const favoriteProducts = ref([])
  const loading = ref(false)

  async function fetchProducts(filters = {}) {
    loading.value = true
    try {
      const { $axios } = useNuxtApp()
      const query = new URLSearchParams(filters).toString()
      const { data } = await $axios.get(`/products?${query}`)
      // favoriteProducts.value = data - кэширование избранных товаров с главной
      const normalized = normalizeProducts(data)
      return normalized
    } catch (error) {
      console.error('Ошибка загрузки товаров', error)
      return []
    } finally {
      loading.value = false
    }
  }

  return { favoriteProducts, fetchProducts, loading }
})
