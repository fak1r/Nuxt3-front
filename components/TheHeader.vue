<template>
  <nav class="nav" aria-label="Основная навигация">
    <NuxtLink to="/" active-class="active">
      <SvgIcons icon="logo" />
    </NuxtLink>

    <button class="nav__item nav__catalog" aria-label="Каталог" @click="openCatalogModal">
      <SvgIcons icon="catalog" />
      <span>Каталог</span>
    </button>

    <form class="search-form" role="search">
      <TheSearch v-model="search" />
    </form>

    <NuxtLink to="/cart" class="nav__item" active-class="active">
      <SvgIcons icon="cart" />
      <span>Корзина</span>
    </NuxtLink>

    <button v-if="!hasUser" class="nav__item" aria-label="Войти в аккаунт" @click="openAuthModal">
      <SvgIcons icon="profile" />
      <span>Войти</span>
    </button>

    <NuxtLink v-else to="/profile" class="nav__item" active-class="active">
      <SvgIcons icon="profile" />
      <span>Профиль</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import TheSearch from '~/components/UI/TheSearch.vue'

interface Emits {
  (e: 'open-auth-modal' | 'open-catalog-modal'): void
}

const emit = defineEmits<Emits>()

const authStore = useAuthStore()

const user = computed(() => authStore.user)
const hasUser = computed(() => !!user.value?.email)
const search = ref('')

function openAuthModal() {
  emit('open-auth-modal')
}

function openCatalogModal() {
  emit('open-catalog-modal')
}
</script>

<style scoped lang="scss">
.nav {
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

    &.active {
      color: var(--menu-items-color-active);
    }
  }

  &__item {
    color: var(--menu-items-color);
    transition: color 0.3s ease-in-out;

    svg {
      color: inherit;
      transition: color 0s ease-in-out;
    }

    &:hover {
      color: var(--menu-items-color-hover) !important;
    }
  }

  form {
    width: 100%;
  }

  &__catalog {
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
    svg {
      margin-bottom: -4px;
    }

    @include phone {
      display: none;
    }
  }
}
</style>
