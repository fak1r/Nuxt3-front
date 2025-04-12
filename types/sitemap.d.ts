declare module '@nuxtjs/sitemap' {
  interface SitemapConfig {
    hostname?: string
    gzip?: boolean
    routes?: () => Promise<string[]>
  }
}
