import { useModalStore } from '@/store/modal'
import { useAuthStore } from '@/store/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!('auth' in to.query)) return

  const authStore = useAuthStore()

  if (!authStore.accessToken) {
    await authStore.refresh()
  }

  if (authStore.accessToken) {
    return navigateTo('/', { replace: true })
  }

  const modalStore = useModalStore()
  modalStore.close()
  modalStore.open('auth')
})
