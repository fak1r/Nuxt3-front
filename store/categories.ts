import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<{ id: number; name: string }[]>([])
  const subcategories = ref<{ id: number; name: string; category_id: number }[]>([])
  const loaded = ref(false)

  const { $axios } = useNuxtApp()

  async function fetchCategories() {
    try {
      const { data } = await $axios.get('/categories')
      categories.value = [{ id: null, name: 'Все категории' }, ...data]
    } catch (error) {
      console.error('Ошибка загрузки категорий', error)
    }
  }

  async function fetchSubcategories() {
    try {
      const { data } = await $axios.get('/subcategories')
      subcategories.value = data
      loaded.value = true
    } catch (error) {
      console.error('Ошибка загрузки подкатегорий', error)
    }
  }

  async function init() {
    if (!loaded.value) {
      await fetchCategories()
      await fetchSubcategories()
    }
  }

  return {
    categories,
    subcategories,
    loaded,
    fetchCategories,
    fetchSubcategories,
    init,
  }
})
