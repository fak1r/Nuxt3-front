import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const GENERATED_ROUTES_PATH = resolve('.generated-routes.json')

export const STATIC_GENERATED_ROUTES = ['/', '/catalog', '/contacts', '/cart', '/404', '/profile', '/admin']

export function normalizePath(path) {
  if (!path) return '/'
  if (path === '/') return '/'

  const normalized = path.startsWith('/') ? path : `/${path}`
  return normalized.replace(/\/+$/, '')
}

export function prepareGeneratedRoutes(paths) {
  return Array.from(new Set(paths.map((path) => normalizePath(path))))
    .sort((a, b) => a.localeCompare(b))
}

export function readGeneratedRoutes(context) {
  if (!existsSync(GENERATED_ROUTES_PATH)) {
    console.warn(`No .generated-routes.json found for ${context}. Run \`yarn generate:routes\` first.`)
    return []
  }

  try {
    const raw = readFileSync(GENERATED_ROUTES_PATH, 'utf-8')
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      console.warn('Invalid .generated-routes.json format. Expected string[].')
      return []
    }

    return prepareGeneratedRoutes(parsed.filter((route) => typeof route === 'string' && route.length > 0))
  } catch (error) {
    console.warn(`Failed to read .generated-routes.json for ${context}.`, error)
    return []
  }
}
