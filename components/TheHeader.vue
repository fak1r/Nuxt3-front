<template>
  <nav aria-label="Основная навигация">
    <NuxtLink to="/">
      <SvgIcons icon="logo" />
    </NuxtLink>

    <button class="catalog" aria-label="Каталог" @click="openCatalogModal">
      <SvgIcons icon="catalog" />
      <span>Каталог</span>
    </button>

    <form class="search-form" role="search">
      <TheSearch v-model="search" />
    </form>

    <NuxtLink to="/cart">
      <SvgIcons icon="cart" />
      <span>Корзина</span>
    </NuxtLink>

    <button v-if="!hasUser" aria-label="Войти в аккаунт" @click="openAuthModal">
      <SvgIcons icon="profile" />
      <span>Войти</span>
    </button>

    <NuxtLink v-else to="/profile">
      <SvgIcons icon="profile" />
      <span>Профиль</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import type { User } from '~/types/auth.types'
import TheSearch from '~/components/UI/TheSearch.vue'

interface Emits {
  (e: 'open-auth-modal' | 'open-catalog-modal'): void
}

const emit = defineEmits<Emits>()

const authStore = useAuthStore()

const user = ref({} as User | null)
const hasUser = computed(() => !!user.value?.email)
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

function openAuthModal() {
  emit('open-auth-modal')
}

function openCatalogModal() {
  emit('open-catalog-modal')
}
</script>

<style scoped lang="scss">
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  & > :first-child {
    margin-right: 100px;
  }

  a {
    display: flex;
    align-items: center;
    flex-direction: column;

    @include phone {
      display: none;
    }
  }

  form {
    width: 100%;
  }

  .catalog {
    background-color: var(--border);
    border-radius: 8px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 4px;

    @include phone {
      display: none;
    }
  }

  button {
    @include phone {
      display: none;
    }
  }
}
</style>
