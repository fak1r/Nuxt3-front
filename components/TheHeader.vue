<template>
  <nav aria-label="Основная навигация">
    <NuxtLink to="/">
      <SvgIcons icon="logo" />
    </NuxtLink>
    <!-- <NuxtLink to="/">Главная</NuxtLink>
    <NuxtLink to="/products">Товары</NuxtLink>
    <NuxtLink v-if="!hasUser" to="/auth">Вход</NuxtLink>
    <NuxtLink v-if="isAdmin" to="/admin">Админка</NuxtLink>
    <button v-if="isAdmin" @click="pingDB">Ping DB</button>
    <TheButton v-if="hasUser" variant="Secondary" size="sm" @click="handleLogout">{{ user?.name }} Выход</TheButton> -->

    <NuxtLink class="catalog" to="/catalog">
      <SvgIcons icon="catalog" />
      <span>Каталог</span>
    </NuxtLink>
    <form class="search-form" role="search">
      <TheSearch v-model="search" />
    </form>
    <NuxtLink to="/cart">
      <SvgIcons icon="cart" />
    </NuxtLink>
    <NuxtLink to="/profile">
      <SvgIcons icon="profile" />
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import type { User } from '~/types/auth.types'
import TheSearch from '~/components/UI/TheSearch.vue'

const authStore = useAuthStore()

const user = ref({} as User | null)
const hasUser = computed(() => !!user.value?.email)
const isAdmin = computed(() => !!user.value?.is_admin)
const search = ref('')

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
}
</script>

<style scoped lang="scss">
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  & > :first-child {
    margin-right: 200px;
  }

  a {
    display: flex;
    gap: 4px;
    text-decoration: none;
  }

  form {
    width: 100%;
  }

  .catalog {
    background-color: var(--border);
    border-radius: 8px;
    padding: 4px 8px;
  }
}
</style>
