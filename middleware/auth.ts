import { useAuthStore } from '@/store/auth'
import { useModalStore } from '@/store/modal'
import { getSafeRouteRedirect } from '~/utils/get-safe-route-redirect'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const modalStore = useModalStore()
  const requiresAdmin = Boolean(to.meta.requiresAdmin)
  const requiresAuth = Boolean(to.meta.requiresAuth || requiresAdmin)
  const authRedirect = {
    path: '/',
    query: {
      auth: '1',
      redirect: getSafeRouteRedirect(to.fullPath, '/'),
    },
  }

  if (!requiresAuth) return

  if (!authStore.accessToken) {
    const refreshed = await authStore.refresh()

    if (!refreshed || !authStore.accessToken) {
      return navigateTo(authRedirect)
    }
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
