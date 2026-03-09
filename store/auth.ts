import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import type { User } from '~/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const accessToken = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => !!user.value?.is_admin)
  let refreshPromise: Promise<boolean> | null = null

  function setTokens(access: string | null) {
    accessToken.value = access
  }

  function setUser(userData: User) {
    user.value = { ...userData }
  }

  function clearAuthState() {
    accessToken.value = null
    user.value = null
  }

  async function logout() {
    try {
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error: any) {
      console.error('Ошибка при выходе:', error.message)
    } finally {
      clearAuthState()
    }
  }

  async function login(email: string, password: string) {
    try {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.post(
        '/auth/login',
        {
          email,
          password,
        },
        { withCredentials: true },
      )

      setTokens(data.access_token)
      setUser(data.user)

      return true
    } catch (error: any) {
      console.error('Ошибка авторизации:', error.response?.data?.detail || error.message)
      return false
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const { $axios } = useNuxtApp()
      await $axios.post('/auth/register', {
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
    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = (async () => {
      try {
        const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
        const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers,
        })

        if (!response.ok) {
          clearAuthState()
          return false
        }

        const data = await response.json()

        setTokens(data.access_token)
        setUser(data.user)
        return true
      } catch (error: any) {
        console.error('Ошибка обновления токена:', error.message)
        clearAuthState()
        return false
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  return {
    accessToken,
    user,
    isAuthenticated,
    isAdmin,
    setTokens,
    setUser,
    clearAuthState,
    logout,
    login,
    register,
    refresh,
  }
})
