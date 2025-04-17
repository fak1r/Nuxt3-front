import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import type { Category, Producer, ProductLine } from '~/types/categories.types'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const producers = ref<Producer[]>([])
  const productLines = ref<ProductLine[]>([])
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
