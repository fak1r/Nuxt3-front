import { useModalStore } from '@/store/modal'
import { useAuthStore } from '@/store/auth'
import { getSafeRouteRedirect } from '~/utils/get-safe-route-redirect'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!('auth' in to.query)) return

  const authStore = useAuthStore()
  const redirectTarget = getSafeRouteRedirect(to.query.redirect, '/')

  if (!authStore.accessToken) {
    await authStore.refresh()
  }

  if (authStore.accessToken) {
    return navigateTo(redirectTarget, { replace: true })
  }

  const modalStore = useModalStore()
  modalStore.close()
  modalStore.open('auth')
})
