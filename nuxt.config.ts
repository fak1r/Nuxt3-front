// https://nuxt.com/docs/api/configuration/nuxt-config
import getSitemapRoutes from './scripts/get-sitemap-routes'
import appHead from './config/head'
import { getPrerenderRoutes } from './utils/get-prerender-routes'

const fallbackSiteUrl = 'http://localhost:3000'
const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
const rawSiteUrl = process.env.NUXT_PUBLIC_SITE_URL || fallbackSiteUrl

function normalizeSiteUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.hostname = parsed.hostname.replace(/^www\./i, '')
    return parsed.toString().replace(/\/+$/, '')
  } catch {
    return fallbackSiteUrl
  }
}

const siteUrl = normalizeSiteUrl(rawSiteUrl)

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  nitro: {
    prerender: {
      routes: getPrerenderRoutes(),
    },
    compressPublicAssets: true,
  },
  site: {
    url: siteUrl,
  },
  app: {
    head: appHead,
  },
  sitemap: {
    hostname: siteUrl,
    name: 'Зам Пол - магазин напольных покрытий',
    gzip: true,
    exclude: ['/admin', '/profile', '/cart', '/404'],
    urls: () => getSitemapRoutes(),
    autoLastmod: true,
    discoverImages: true,
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
    },
  },
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxtjs/sitemap'],
  runtimeConfig: {
    public: {
      apiBaseUrl: apiBaseUrl,
      siteUrl: siteUrl,
      isStatic: process.env.NUXT_IS_STATIC === 'true',
    },
  },
  css: ['@/assets/styles/global.scss', 'swiper/css'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/mixins" as *;`,
        },
      },
    },
  },
})
