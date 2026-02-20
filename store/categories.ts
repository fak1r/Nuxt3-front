import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import type { Category, Producer, ProductLine } from '~/types/categories.types'

const sharedCatalogCache = {
  categories: null as Category[] | null,
  producers: null as Producer[] | null,
  productLines: null as ProductLine[] | null,
  categoriesPromise: null as Promise<Category[]> | null,
  producersPromise: null as Promise<Producer[]> | null,
  productLinesPromise: null as Promise<ProductLine[]> | null,
}

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const producers = ref<Producer[]>([])
  const productLines = ref<ProductLine[]>([])
  const loaded = ref(false)

  const { $axios } = useNuxtApp()

  async function fetchCategories() {
    if (categories.value.length > 0) return

    if (sharedCatalogCache.categories) {
      categories.value = sharedCatalogCache.categories
      return
    }

    try {
      if (!sharedCatalogCache.categoriesPromise) {
        sharedCatalogCache.categoriesPromise = $axios
          .get<Category[]>('products/categories')
          .then(({ data }) => {
            sharedCatalogCache.categories = data
            return data
          })
          .finally(() => {
            sharedCatalogCache.categoriesPromise = null
          })
      }

      categories.value = await sharedCatalogCache.categoriesPromise
    } catch (error) {
      console.error('Ошибка загрузки категорий', error)
    }
  }

  async function fetchProducers() {
    if (producers.value.length > 0) return

    if (sharedCatalogCache.producers) {
      producers.value = sharedCatalogCache.producers
      return
    }

    try {
      if (!sharedCatalogCache.producersPromise) {
        sharedCatalogCache.producersPromise = $axios
          .get<Producer[]>('products/producers')
          .then(({ data }) => {
            sharedCatalogCache.producers = data
            return data
          })
          .finally(() => {
            sharedCatalogCache.producersPromise = null
          })
      }

      producers.value = await sharedCatalogCache.producersPromise
    } catch (error) {
      console.error('Ошибка загрузки производителей', error)
    }
  }

  async function fetchProductLines() {
    if (productLines.value.length > 0) return

    if (sharedCatalogCache.productLines) {
      productLines.value = sharedCatalogCache.productLines
      return
    }

    try {
      if (!sharedCatalogCache.productLinesPromise) {
        sharedCatalogCache.productLinesPromise = $axios
          .get<ProductLine[]>('products/product_lines')
          .then(({ data }) => {
            sharedCatalogCache.productLines = data
            return data
          })
          .finally(() => {
            sharedCatalogCache.productLinesPromise = null
          })
      }

      productLines.value = await sharedCatalogCache.productLinesPromise
    } catch (error) {
      console.error('Ошибка загрузки продуктовых линеек', error)
    }
  }

  async function init() {
    if (!loaded.value) {
      await Promise.all([fetchCategories(), fetchProducers(), fetchProductLines()])
      loaded.value = true
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
