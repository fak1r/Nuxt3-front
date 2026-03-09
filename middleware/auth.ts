import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/modal'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const modalStore = useModalStore()
  const requiresAdmin = Boolean(to.meta.requiresAdmin)
  const requiresAuth = Boolean(to.meta.requiresAuth || requiresAdmin)
  const authRedirect = '/?auth'

  if (!requiresAuth) return

  if (!authStore.accessToken) {
    await authStore.refresh()
  }

  if (!authStore.accessToken) return navigateTo(authRedirect)

  if (requiresAdmin) {
    if (!authStore.isAdmin) return navigateTo(authRedirect)

    try {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.get('/auth/me', { withCredentials: true })

      if (!data.is_admin) return navigateTo(authRedirect)
    } catch {
      return navigateTo(authRedirect)
    }
  }

  modalStore.close()
})
