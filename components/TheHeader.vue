<template>
  <header class="header">
    <div class="header__body">
      <div class="header__logo">Logo</div>
      <nav>
        <NuxtLink to="/">Главная</NuxtLink>
        <NuxtLink v-if="!hasUser" to="/auth">Вход</NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin">Админка</NuxtLink>
        <button v-if="isAdmin" @click="pingDB">Ping DB</button>
        <TheButton v-if="hasUser" variant="Secondary" size="sm" @click="handleLogout">{{ user?.name }} Выход</TheButton>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import type { User } from '~/types/auth.types'
import TheButton from '~/components/UI/TheButton.vue'

const authStore = useAuthStore()

const user = ref({} as User | null)
const hasUser = computed(() => !!user.value?.email)
const isAdmin = computed(() => !!user.value?.is_admin)

authStore.$subscribe(
  () => {
    user.value = authStore.user
  },
  { detached: true },
)

onMounted(() => {
  user.value = authStore.user
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
