import { writeFileSync, appendFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { Product } from '~/types/products.types'

export default defineEventHandler(async () => {
  const logPath = join(process.cwd(), 'popular.log')

  if (!existsSync(logPath)) {
    writeFileSync(logPath, '[popular] лог создан\n', 'utf-8')
  }

  try {
    appendFileSync(logPath, '[popular] start\n')

    const res = await $fetch<{ items: Product[] }>('https://zampol.ru/api/products/popular?page=1&limit=8')

    appendFileSync(logPath, `[popular] success: ${res.items.length} items\n`)
    return res.items
  } catch (err: any) {
    appendFileSync(logPath, '[popular] FAIL: ' + err.message + '\n')
    return []
  }
})
