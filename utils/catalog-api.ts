import { $fetch } from 'ofetch'
import type { Category, Producer } from '~/types/categories.types'

let categoriesCache: Category[] | null = null
let categoriesPromise: Promise<Category[]> | null = null

let producersCache: Producer[] | null = null
let producersPromise: Promise<Producer[]> | null = null

export async function fetchCatalogCategories(baseURL: string): Promise<Category[]> {
  if (categoriesCache) {
    return categoriesCache
  }

  if (!categoriesPromise) {
    categoriesPromise = $fetch<Category[]>('/products/categories', { baseURL }).then((data) => {
      categoriesCache = data
      return data
    })
  }

  try {
    return await categoriesPromise
  } finally {
    categoriesPromise = null
  }
}

export async function fetchCatalogProducers(baseURL: string): Promise<Producer[]> {
  if (producersCache) {
    return producersCache
  }

  if (!producersPromise) {
    producersPromise = $fetch<Producer[]>('/products/producers', { baseURL }).then((data) => {
      producersCache = data
      return data
    })
  }

  try {
    return await producersPromise
  } finally {
    producersPromise = null
  }
}
