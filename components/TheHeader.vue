<template>
  <nav class="nav" aria-label="Основная навигация">
    <NuxtLink to="/" class="nav__item" active-class="active">
      <SvgIcons icon="logo" />
    </NuxtLink>

    <button
      class="nav__item nav__catalog"
      v-bind="activeStyle('catalog')"
      aria-label="Каталог"
      @click="toggleCatalogModal"
    >
      <span v-if="modalStore.isCatalogVisible" class="nav__catalog-icon">✕</span>
      <SvgIcons v-else class="nav__catalog-icon" icon="catalog" />
      <span>Каталог</span>
    </button>

    <form class="search-form" role="search">
      <TheSearch v-model="search" />
    </form>

    <NuxtLink to="/cart" class="nav__item" active-class="active">
      <SvgIcons icon="cart" />
      <span>Корзина</span>
    </NuxtLink>

    <button
      v-if="!hasUser"
      v-bind="activeStyle('auth')"
      class="nav__item nav__profile-btn"
      aria-label="Войти в аккаунт"
      @click="openAuthModal"
    >
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
import { useAuthStore } from '~/store/auth'
import { useModalStore } from '~/store/modal'
import TheSearch from '~/components/UI/TheSearch.vue'

const modalStore = useModalStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const hasUser = computed(() => !!user.value?.email)
const search = ref('')

function openAuthModal() {
  modalStore.open('auth')
}

function toggleCatalogModal() {
  if (modalStore.isCatalogVisible) modalStore.close()
  else modalStore.open('catalog')
}

function activeStyle(name: 'catalog' | 'auth') {
  return {
    style: { color: (name === 'catalog' ? modalStore.isCatalogVisible : modalStore.isAuthVisible) ? 'black' : '' },
  }
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

    &-icon {
      width: 24px;
    }
  }

  &__profile-btn {
    svg {
      margin-bottom: -4px;
    }
  }

  button {
    @include phone {
      display: none;
    }
  }
}
</style>
