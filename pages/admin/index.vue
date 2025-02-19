<template>
  <div>
    <h1>Админка</h1>
    <p>Добро пожаловать, {{ authStore.user?.email }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
})
</script>
