<template>
  <nav class="nav" aria-label="Основная навигация">
    <NuxtLink to="/" class="nav__item nav__logo" active-class="active">
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
      <TheSearch v-model="search" :search-results="searchResults" />
      <NuxtLink v-if="isMobile" to="/contacts" class="nav__item nav__contacts" active-class="active">
        <SvgIcons icon="geo-square" :size="'md'" />
        <span>Контакты</span>
      </NuxtLink>
    </form>

    <div class="nav__actions">
      <NuxtLink v-if="!isMobile" to="/contacts" class="nav__item" active-class="active">
        <SvgIcons icon="geo" />
        <span>Контакты</span>
      </NuxtLink>

      <NuxtLink to="/cart" class="nav__item nav__cart" active-class="active">
        <CartNavIcon />
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
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { useModalStore } from '~/store/modal'
import TheSearch from '~/components/UI/TheSearch.vue'
import CartNavIcon from '~/components/UI/CartNavIcon.vue'

const modalStore = useModalStore()
const authStore = useAuthStore()

const { isMobile } = useIsMobile()

const user = computed(() => authStore.user)
const hasUser = computed(() => !!user.value?.email)

const search = ref('')
const { searchResults } = useProductSearch(search)

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

  &__logo {
    margin-right: 100px;

    @include phone {
      display: none;
    }
  }

  a {
    &.active {
      color: var(--menu-items-color-active);
    }
  }

  &__item {
    color: var(--menu-items-color);
    transition: color 0.3s ease-in-out;

    &:hover {
      color: var(--menu-items-color-hover) !important;
    }

    svg {
      color: inherit;
      transition: color 0s ease-in-out;
    }
  }

  &__cart {
    position: relative;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;

    @include phone {
      display: none;
    }

    a {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
  }

  .search-form {
    display: flex;
    width: 100%;
    gap: 8px;
  }

  &__contacts {
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;

    span {
      @include phone {
        display: none;
      }
    }
  }

  &__catalog {
    background-color: var(--border);
    border-radius: 8px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    border: 1px solid var(--input-border);

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
}
</style>
