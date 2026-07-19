import { readGeneratedRoutes } from './generated-routes-manifest.js'

type SitemapUrl = {
  loc: string
}

function toSitemapUrls(paths: string[]): SitemapUrl[] {
  return paths.map((loc) => ({ loc }))
}

export default function getSitemapRoutes(): SitemapUrl[] {
  const generatedRoutes = readGeneratedRoutes('sitemap')
  return toSitemapUrls(generatedRoutes)
}
