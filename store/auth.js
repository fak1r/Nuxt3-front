import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'

export const useAuthStore = defineStore('auth', () => {
  const { $axios } = useNuxtApp()
  const accessToken = ref(null)
  const refreshToken = ref(null)
  const user = ref(null)

  function setTokens(access, refresh) {
    accessToken.value = access
    refreshToken.value = refresh
  }

  function setUser(email) {
    user.value = { email }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }

  async function login(email, password) {
    try {
      const { data } = await $axios.post(`/login`, {
        email,
        password,
      })

      setTokens(data.access_token, data.refresh_token)
      setUser(email)

      return true
    } catch (error) {
      console.error('Ошибка авторизации:', error.response?.data?.detail || error.message)
      return false
    }
  }

  return { accessToken, refreshToken, user, setTokens, setUser, logout, login }
})
