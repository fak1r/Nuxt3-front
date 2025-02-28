<template>
  <header class="header">
    <div class="header__body">
      <div class="header__logo">Logo</div>
      <nav>
        <NuxtLink to="/">Главная</NuxtLink>
        <NuxtLink v-if="!email" to="/auth">Вход</NuxtLink>
        <NuxtLink v-if="email" to="/admin">Админка</NuxtLink>
        <button @click="pingDB">Ping DB</button>
        <button v-if="email" @click="handleLogout">Logout</button>
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

onMounted(() => {
  email.value = authStore.user?.email
})

function pingDB() {
  const { $axios } = useNuxtApp()
  $axios.get('/ping_db').then((res) => console.log(res))
}

function handleLogout() {
  authStore.logout()
  navigateTo('/')
}
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  width: 100%;
  height: 64px;
  background-color: rgba(253, 254, 254, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  z-index: 9999;

  &__body {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  nav {
    display: flex;
    gap: 16px;
  }
}
</style>
