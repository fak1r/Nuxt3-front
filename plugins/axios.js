import axios from 'axios'
import { useAuthStore } from '@/store/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const apiBaseUrl = config.public.apiBaseUrl

  const instance = axios.create({
    baseURL: apiBaseUrl,
  })

  instance.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const authStore = useAuthStore()
      if (error.response?.status === 401 && authStore.refreshToken) {
        try {
          const { data } = await instance.post(
            '/refresh',
            new URLSearchParams({ refresh_token: authStore.refreshToken }),
          )
          authStore.setTokens(data.access_token, data.refresh_token)

          error.config.headers.Authorization = `Bearer ${data.access_token}`
          return instance(error.config)
        } catch (refreshError) {
          console.error('Ошибка обновления токена:', refreshError.response?.data?.detail || refreshError.message)
          authStore.logout()
        }
      }
      return Promise.reject(error)
    },
  )

  return {
    provide: {
      axios: instance,
    },
  }
})
