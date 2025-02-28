import { useAuthStore } from '@/store/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.accessToken) {
    await authStore.refresh()
  }

  if (!authStore.accessToken && to.meta.requiresAuth) {
    return navigateTo('/auth')
  }
})
