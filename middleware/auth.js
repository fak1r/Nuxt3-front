import { useAuthStore } from '@/store/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (!authStore.accessToken && to.meta.requiresAuth) {
    return navigateTo('/login')
  }
})
