import fs from 'fs/promises'

export default {
  siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://5.8.54.84',
  sitemap: {
    gzip: true,
  },
  async urls() {
    const raw = await fs.readFile('./.nuxt/routes.json', 'utf-8')
    const routes: string[] = JSON.parse(raw)
    return routes.map((route) => ({ loc: route }))
  },
}
