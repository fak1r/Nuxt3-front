import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const user = ref(null)

  function setTokens(access) {
    accessToken.value = access
  }

  function setUser(userData) {
    user.value = { ...userData }
  }

  async function logout() {
    try {
      const { $axios } = useNuxtApp()
      await $axios.post(`/logout`, {}, { withCredentials: true })

      accessToken.value = null
      user.value = null
      localStorage.removeItem('isAuthenticated')
    } catch (error) {
      console.error('Ошибка при выходе:', error.message)
    }
  }

  async function login(email, password) {
    try {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.post(
        `/login`,
        {
          email,
          password,
        },
        { withCredentials: true },
      )

      setTokens(data.access_token)
      setUser(data.user)
      localStorage.setItem('isAuthenticated', 'true')

      return true
    } catch (error) {
      console.error('Ошибка авторизации:', error.response?.data?.detail || error.message)
      return false
    }
  }

  async function register(name, email, password) {
    try {
      const { $axios } = useNuxtApp()
      await $axios.post(`/register`, {
        name,
        email,
        password,
      })

      return await login(email, password)
    } catch (error) {
      console.error('Ошибка регистрации:', error.response?.data?.detail || error.message)
      return false
    }
  }

  async function refresh() {
    try {
      if (!(localStorage.getItem('isAuthenticated') === 'true')) {
        console.log('return refrash')
        return
      }

      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl
      const response = await fetch(`${apiBaseUrl}/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Ошибка обновления токена')
      }

      const data = await response.json()

      localStorage.setItem('isAuthenticated', 'true')
      setTokens(data.access_token)
      setUser(data.user)
    } catch (error) {
      console.error('Ошибка обновления токена:', error.message)
      localStorage.removeItem('isAuthenticated')
      logout()
    }
  }

  return { accessToken, user, setTokens, setUser, logout, login, register, refresh }
})
