import { useAuthStore } from '@/store/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (to.path.startsWith('/admin')) {
    if (!authStore.user?.is_admin) return navigateTo('/')

    try {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.get('/me', { withCredentials: true })

      if (!data.is_admin) {
        alert('Требуются права администратора')
        return navigateTo('/')
      }
    } catch {
      return navigateTo('/')
    }
  }

  if (!authStore.accessToken && authStore.hasRefreshToken) {
    await authStore.refresh()
  }

  if (!authStore.accessToken && to.meta.requiresAuth) {
    return navigateTo('/auth')
  }
})
