import { useAuthStore } from '@/store/auth'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  if (!authStore.accessToken) {
    await authStore.refresh()
  }
})
