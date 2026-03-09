<template>
  <div>
    <h1 class="admin">Админка</h1>
    <p>Добро пожаловать, {{ authStore.user?.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'

definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
  requiresAdmin: true,
})

const authStore = useAuthStore()
</script>
