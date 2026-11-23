import { $fetch } from 'ofetch'
import type { Category, Producer, ProducerCatalogItem, ProductLine } from '~/types/categories.types'

let categoriesCache: Category[] | null = null
let categoriesPromise: Promise<Category[]> | null = null

let producersCache: Producer[] | null = null
let producersPromise: Promise<Producer[]> | null = null

let productLinesCache: ProductLine[] | null = null
let productLinesPromise: Promise<ProductLine[]> | null = null

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

export async function fetchCatalogProductLines(baseURL: string): Promise<ProductLine[]> {
  if (productLinesCache) {
    return productLinesCache
  }

  if (!productLinesPromise) {
    productLinesPromise = $fetch<ProductLine[]>('/products/product_lines', { baseURL }).then((data) => {
      productLinesCache = data
      return data
    })
  }

  try {
    return await productLinesPromise
  } finally {
    productLinesPromise = null
  }
}

export function fetchCategoryCatalog(baseURL: string, categorySlug: string): Promise<ProducerCatalogItem[]> {
  return $fetch<ProducerCatalogItem[]>(`/products/${categorySlug}/catalog`, { baseURL })
}
