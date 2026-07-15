<template>
  <div v-if="isCheckingAccess" class="admin admin--loading">Проверяем доступ...</div>
  <div v-else-if="canRenderPage">
    <h1 class="admin">Админка</h1>
    <p>Добро пожаловать, {{ authStore.user?.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const { isCheckingAccess, canRenderPage } = useProtectedPage({ requiresAdmin: true })
</script>

<style scoped lang="scss">
.admin {
  &--loading {
    text-align: center;
  }
}
</style>
