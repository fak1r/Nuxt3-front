import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import type { User } from '~/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isClient = import.meta.client
  const hasRefreshToken = computed(() => {
    return isClient ? localStorage.getItem('isAuthenticated') === 'true' : false
  })

  function setTokens(access: string) {
    accessToken.value = access
  }

  function setUser(userData: User) {
    user.value = { ...userData }
  }

  async function logout() {
    try {
      const { $axios } = useNuxtApp()
      await $axios.post(`/auth/logout`, {}, { withCredentials: true })

      accessToken.value = null
      user.value = null
      localStorage.removeItem('isAuthenticated')
    } catch (error: any) {
      console.error('Ошибка при выходе:', error.message)
    }
  }

  async function login(email: string, password: string) {
    try {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.post(
        `/auth/login`,
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
    } catch (error: any) {
      console.error('Ошибка авторизации:', error.response?.data?.detail || error.message)
      return false
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const { $axios } = useNuxtApp()
      await $axios.post(`/auth/register`, {
        name,
        email,
        password,
      })

      return await login(email, password)
    } catch (error: any) {
      console.error('Ошибка регистрации:', error.response?.data?.detail || error.message)
      return false
    }
  }

  async function refresh() {
    try {
      if (!hasRefreshToken.value) {
        return
      }

      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl
      const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
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
    } catch (error: any) {
      console.error('Ошибка обновления токена:', error.message)
      localStorage.removeItem('isAuthenticated')
      logout()
    }
  }

  return { accessToken, user, hasRefreshToken, setTokens, setUser, logout, login, register, refresh }
})
