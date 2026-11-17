import fs from 'fs'
import path from 'path'
import axios from 'axios'
import type { Producer } from '~/types/categories.types'
import {
  GENERATED_ROUTES_PATH,
  GENERATED_SITEMAP_IMAGES_PATH,
  STATIC_GENERATED_ROUTES,
  normalizePath,
  prepareGeneratedRoutes,
} from './generated-routes-manifest.js'

const API_BASE = process.env.NUXT_PUBLIC_API_BASE_URL || 'https://zampol.ru/api'
const api = axios.create({
  baseURL: API_BASE,
  proxy: false,
})
const IMAGE_FETCH_CONCURRENCY = 6

async function getCategories() {
  const { data } = await api.get('/products/categories')
  return data
}

async function getProducers() {
  const { data } = await api.get('/products/producers')
  return data
}

async function getProducts(categorySlug: string, producerSlug: string) {
  const { data } = await api.get(`/products/${categorySlug}/${producerSlug}`, {
    params: {
      page: 1,
      limit: 9999,
    },
  })
  return data.items
}

async function getProductImages(productRoute: string) {
  const { data } = await api.get(`/products${productRoute}`)
  return getOriginalImageUrls(data.images)
}

function getOriginalImageUrls(images: unknown): string[] {
  if (!Array.isArray(images)) return []

  const urls = images
    .map((image) => {
      if (typeof image !== 'object' || image === null) return null

      const imageUrl = (image as { image_url?: unknown }).image_url
      if (typeof imageUrl !== 'string') return null

      try {
        const url = new URL(imageUrl)
        return url.protocol === 'https:' ? url.toString() : null
      } catch {
        return null
      }
    })
    .filter((imageUrl): imageUrl is string => imageUrl !== null)

  return [...new Set(urls)]
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++
      results[index] = await mapper(items[index])
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker))
  return results
}

async function generateRoutes() {
  const categories = await getCategories()
  const producers = await getProducers()
  const routes: string[] = [...STATIC_GENERATED_ROUTES]
  const productRoutes = new Set<string>()

  for (const category of categories) {
    routes.push(`/${category.slug}`)

    const relatedProducers = producers.filter((p: Producer) => p.category_id === category.id)

    for (const producer of relatedProducers) {
      const baseRoute = `/${category.slug}/${producer.slug}`
      routes.push(baseRoute)

      try {
        const products = await getProducts(category.slug, producer.slug)
        for (const product of products) {
          if (product.self) {
            const productRoute = normalizePath(product.self)
            routes.push(productRoute)
            productRoutes.add(productRoute)
          }
        }
      } catch (err: any) {
        console.warn(`Failed to load products for ${baseRoute}: ${err.message}`)
      }
    }
  }

  const outputPath = path.resolve(GENERATED_ROUTES_PATH)
  const preparedRoutes = prepareGeneratedRoutes(routes)
  const productImages = await mapWithConcurrency([...productRoutes], IMAGE_FETCH_CONCURRENCY, async (productRoute) => {
    try {
      return { loc: productRoute, images: await getProductImages(productRoute) }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`Failed to load images for ${productRoute}: ${message}`)
      return { loc: productRoute, images: [] }
    }
  })
  const preparedSitemapImages = productImages
    .filter(({ loc, images }) => preparedRoutes.includes(loc) && images.length > 0)
    .sort((a, b) => a.loc.localeCompare(b.loc))

  fs.writeFileSync(outputPath, JSON.stringify(preparedRoutes, null, 2), 'utf-8')
  fs.writeFileSync(GENERATED_SITEMAP_IMAGES_PATH, JSON.stringify(preparedSitemapImages, null, 2), 'utf-8')
  console.log(`Saved ${preparedRoutes.length} routes to ${outputPath}`)
  console.log(`Saved ${preparedSitemapImages.length} product image sets to ${GENERATED_SITEMAP_IMAGES_PATH}`)
}

generateRoutes().catch((err) => {
  console.error('Route generation failed:', err)
})
