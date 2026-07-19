import { useAuthStore } from '~/store/auth'
import { useModalStore } from '~/store/modal'
import { getSafeRouteRedirect, normalizeInternalPath } from '~/utils/get-safe-route-redirect'

interface ProtectedPageOptions {
  requiresAdmin?: boolean
}

export function useProtectedPage(options: ProtectedPageOptions = {}) {
  const authStore = useAuthStore()
  const modalStore = useModalStore()
  const route = useRoute()
  const { $axios } = useNuxtApp()

  const isCheckingAccess = ref(true)
  const hasAccess = ref(false)

  const redirectTarget = computed(() => getSafeRouteRedirect(route.fullPath, '/profile'))

  async function redirectGuestToAuth() {
    modalStore.openAuth(redirectTarget.value)
    await navigateTo('/', { replace: true })
  }

  async function verifyAdminAccess() {
    if (authStore.isAdmin) {
      return true
    }

    try {
      const { data } = await $axios.get('/auth/me', { withCredentials: true })

      if (!data?.is_admin) {
        return false
      }

      authStore.setUser(data)
      return true
    } catch {
      return false
    }
  }

  async function checkAccess() {
    if (!authStore.accessToken) {
      const refreshed = await authStore.refresh()

      if (!refreshed || !authStore.accessToken) {
        await redirectGuestToAuth()
        return
      }
    }

    if (options.requiresAdmin) {
      const isAdminAllowed = await verifyAdminAccess()

      if (!isAdminAllowed) {
        if (!authStore.isAuthenticated) {
          await redirectGuestToAuth()
          return
        }

        await navigateTo(normalizeInternalPath('/profile'), { replace: true })
        return
      }
    }

    hasAccess.value = true
    isCheckingAccess.value = false
  }

  onMounted(async function initProtectedPage() {
    await checkAccess()
  })

  return {
    isCheckingAccess,
    canRenderPage: computed(() => hasAccess.value && !isCheckingAccess.value),
  }
}
