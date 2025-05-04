import { readFileSync } from 'fs'
import { join } from 'path'
import type { Product } from '~/types/products.types'

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), '.generated-routes.json')
  const allProducts: Product[] = []

  try {
    const raw = readFileSync(filePath, 'utf-8')
    const routes: string[] = JSON.parse(raw)

    for (const route of routes) {
      if (route.split('/').length !== 3) continue

      const url = `https://zampol.ru/api/products${route}?limit=9999`

      try {
        const res = await $fetch<{ items: Product[] }>(url)
        allProducts.push(...res.items)
      } catch (err: any) {
        console.warn(`[${route}] ошибка загрузки: ${err.message}`)
      }
    }

    return allProducts
  } catch (err: any) {
    console.error('❌ Ошибка чтения .generated-routes.json:', err.message)
    return []
  }
})
