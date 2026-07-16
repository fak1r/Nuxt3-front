import fs from 'fs'
import path from 'path'
import axios from 'axios'
import type { Producer } from '~/types/categories.types'

const API_BASE = process.env.NUXT_PUBLIC_API_BASE_URL || 'https://zampol.ru/api'
const api = axios.create({
  baseURL: API_BASE,
  proxy: false,
})

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

async function generateRoutes() {
  const categories = await getCategories()
  const producers = await getProducers()

  const routes: string[] = []

  for (const category of categories) {
    const relatedProducers = producers.filter((p: Producer) => p.category_id === category.id)

    for (const producer of relatedProducers) {
      const baseRoute = `/${category.slug}/${producer.slug}`
      routes.push(baseRoute)

      try {
        const products = await getProducts(category.slug, producer.slug)
        for (const product of products) {
          if (product.self) {
            routes.push(product.self)
          }
        }
      } catch (err: any) {
        console.warn(`⚠️ Не удалось загрузить продукты для ${baseRoute}: ${err.message}`)
      }
    }
  }

  const outputPath = path.resolve('./.generated-routes.json')

  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2), 'utf-8')
  console.log(`✅ Сохранено ${routes.length} маршрутов в ${outputPath}`)
}

generateRoutes().catch((err) => {
  console.error('Ошибка генерации маршрутов:', err)
})
