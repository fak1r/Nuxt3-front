import { useAuthStore } from '@/store/auth'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  if (authStore.refreshToken) {
    authStore.login(authStore.user?.email, authStore.refreshToken).catch(() => {
      authStore.logout()
    })
  }
})
