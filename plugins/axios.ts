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
      const originalRequest = error.config as (typeof error.config & { _retry?: boolean })

      if (error.response?.status === 401 && !originalRequest?._retry) {
        try {
          originalRequest._retry = true
          const refreshed = await authStore.refresh()

          if (!refreshed || !authStore.accessToken) {
            await authStore.logout()
            return Promise.reject(error)
          }

          originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
          return instance(originalRequest)
        } catch {
          await authStore.logout()
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
