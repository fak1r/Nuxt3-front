import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)

  async function fetchProducts(filters = {}) {
    loading.value = true
    console.log('fetchProducts', filters)
    try {
      const { $axios } = useNuxtApp()
      const query = new URLSearchParams(filters).toString()
      console.log(query)
      const { data } = await $axios.get(`/products?${query}`)
      products.value = data
    } catch (error) {
      console.error('Ошибка загрузки товаров', error)
    } finally {
      loading.value = false
    }
  }

  return { products, fetchProducts, loading }
})
