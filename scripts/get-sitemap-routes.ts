import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

type SitemapUrl = {
  loc: string
}

function normalizePath(path: string): string {
  if (!path) return '/'
  return path.startsWith('/') ? path : `/${path}`
}

function readGeneratedRoutes(): string[] {
  const generatedRoutesPath = resolve('.generated-routes.json')

  if (!existsSync(generatedRoutesPath)) {
    console.warn('No .generated-routes.json found for sitemap. Run `yarn generate:routes` first.')
    return []
  }

  try {
    const raw = readFileSync(generatedRoutesPath, 'utf-8')
    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      console.warn('Invalid .generated-routes.json format. Expected string[].')
      return []
    }

    return parsed.filter((route): route is string => typeof route === 'string' && route.length > 0)
  } catch {
    console.warn('Failed to read .generated-routes.json for sitemap.')
    return []
  }
}

function toSitemapUrls(paths: string[]): SitemapUrl[] {
  return Array.from(new Set(paths.map((path) => normalizePath(path))))
    .sort((a, b) => a.localeCompare(b))
    .map((loc) => ({ loc }))
}

export default async function getSitemapRoutes(): Promise<SitemapUrl[]> {
  const generatedRoutes = readGeneratedRoutes()
  return toSitemapUrls(generatedRoutes)
}
