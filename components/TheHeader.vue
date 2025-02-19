<template>
  <header class="header">
    <div class="header__body">
      <div class="header__logo">Logo</div>
      <nav>
        <NuxtLink to="/">Главная</NuxtLink>
        <NuxtLink to="/login">Войти</NuxtLink>
        <NuxtLink v-if="email" to="/admin">Админка</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const email = ref('')

authStore.$subscribe(
  () => {
    email.value = authStore.user?.email
  },
  { detached: true },
)
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 64px;
  background-color: #edede6;
  display: flex;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;

  &__body {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  nav {
    display: flex;
    gap: 16px;
    a {
      color: black;
    }
  }
}
</style>
