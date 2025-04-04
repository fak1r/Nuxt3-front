// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
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
