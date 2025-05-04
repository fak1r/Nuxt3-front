// https://nuxt.com/docs/api/configuration/nuxt-config
import getSitemapRoutes from './scripts/get-sitemap-routes'
import appHead from './config/head'
import { getPrerenderRoutes } from './utils/get-prerender-routes'

const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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
    url: siteUrl || 'http://5.8.54.84',
  },
  app: {
    head: appHead,
  },
  sitemap: {
    hostname: siteUrl || 'http://localhost:3000',
    name: 'Зам Пол - магазин напольных покрытий',
    gzip: true,
    exclude: ['/admin', '/profile', '/cart'],
    routes: () => getSitemapRoutes(apiBaseUrl),
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
