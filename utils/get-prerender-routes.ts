import { readFileSync, existsSync } from 'fs'

export function getPrerenderRoutes(): string[] {
  const path = './.generated-routes.json'

  if (!existsSync(path)) {
    console.warn('⚠️ Нет .generated-routes.json. Запусти generate:routes перед generate.')
    return []
  }

  try {
    const raw = readFileSync(path, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    console.error('❌ Ошибка чтения .generated-routes.json:', e)
    return []
  }
}
