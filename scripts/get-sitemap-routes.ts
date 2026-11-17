import { readGeneratedRoutes, readGeneratedSitemapImages } from './generated-routes-manifest.js'

type SitemapUrl = {
  loc: string
  images?: { loc: string }[]
}

function toSitemapUrls(paths: string[]): SitemapUrl[] {
  const imagesByRoute = new Map(
    readGeneratedSitemapImages('sitemap').map(({ loc, images }) => [loc, images]),
  )

  return paths.map((loc) => {
    const images = imagesByRoute.get(loc)

    return images ? { loc, images: images.map((image) => ({ loc: image })) } : { loc }
  })
}

export default function getSitemapRoutes(): SitemapUrl[] {
  const generatedRoutes = readGeneratedRoutes('sitemap')
  return toSitemapUrls(generatedRoutes)
}
