import { useAuthStore } from '@/store/auth'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  if (!authStore.accessToken) {
    void authStore.refresh()
  }
})
