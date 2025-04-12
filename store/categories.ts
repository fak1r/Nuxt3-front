import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<{ id: number; name: string }[]>([])
  const producers = ref<{ id: number; name: string; category_id: number }[]>([])
  const productLines = ref<{ id: number; name: string; category_id: number }[]>([])
  const loaded = ref(false)

  const { $axios } = useNuxtApp()

  async function fetchCategories() {
    try {
      const { data } = await $axios.get('products/categories')
      categories.value = data
    } catch (error) {
      console.error('Ошибка загрузки категорий', error)
    }
  }

  async function fetchProducers() {
    try {
      const { data } = await $axios.get('products/producers')
      producers.value = data
    } catch (error) {
      console.error('Ошибка загрузки производителей', error)
    }
  }

  async function fetchProductLines() {
    try {
      const { data } = await $axios.get('products/product_lines')
      productLines.value = data
      loaded.value = true
    } catch (error) {
      console.error('Ошибка загрузки продуктовых линеек', error)
    }
  }

  async function init() {
    if (!loaded.value) {
      await fetchCategories()
      await fetchProducers()
      await fetchProductLines()
    }
  }

  return {
    categories,
    producers,
    productLines,
    loaded,
    fetchCategories,
    fetchProducers,
    fetchProductLines,
    init,
  }
})
