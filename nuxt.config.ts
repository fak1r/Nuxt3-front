// https://nuxt.com/docs/api/configuration/nuxt-config
import getSitemapRoutes from './scripts/get-sitemap-routes'
const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  site: {
    url: siteUrl || 'http://5.8.54.84',
  },
  sitemap: {
    hostname: siteUrl || 'http://localhost:3000',
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
