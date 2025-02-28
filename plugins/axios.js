import axios from 'axios'
import { useAuthStore } from '@/store/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl

  const instance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
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
      if (error.response?.status === 401) {
        try {
          await authStore.refresh()
          error.config.headers.Authorization = `Bearer ${authStore.accessToken}`

          return instance(error.config)
        } catch {
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
