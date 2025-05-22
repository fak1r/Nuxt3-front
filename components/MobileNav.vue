<template>
  <nav class="mobile-nav" aria-label="Мобильная навигация">
    <ul>
      <li>
        <NuxtLink to="/" class="mobile-nav__item" active-class="active">
          <SvgIcons icon="home" />
          <span>Главная</span>
        </NuxtLink>
      </li>

      <li>
        <NuxtLink to="/catalog" class="mobile-nav__item" active-class="active">
          <SvgIcons icon="catalog" />
          <span>Каталог</span>
        </NuxtLink>
      </li>

      <li>
        <NuxtLink to="/cart" class="mobile-nav__item mobile-nav__cart" active-class="active">
          <CartNavIcon />
        </NuxtLink>
      </li>

      <li>
        <template v-if="hasUser">
          <NuxtLink to="/profile" class="mobile-nav__item" active-class="active">
            <SvgIcons icon="profile" />
            <span>Профиль</span>
          </NuxtLink>
        </template>
        <template v-else>
          <button type="button" class="mobile-nav__item" v-bind="authBtnStyle" @click="openAuthModal">
            <SvgIcons icon="profile" />
            <span>Войти</span>
          </button>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import SvgIcons from '~/components/Svg/SvgIcons.vue'
import CartNavIcon from '~/components/UI/CartNavIcon.vue'
import { useAuthStore } from '@/store/auth'
import { useModalStore } from '~/store/modal'

const modalStore = useModalStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const hasUser = computed(() => !!user.value?.email)
const authBtnStyle = computed(() => (modalStore.isAuthVisible ? { style: { color: 'black' } } : {}))

function openAuthModal() {
  modalStore.open('auth')
}
</script>

<style lang="scss">
.mobile-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 49px;
  background-color: rgba(253, 254, 254, 0.5);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border);
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  z-index: 900;
  display: flex;

  &__item {
    color: var(--menu-items-color);
    transition: color 0.3s ease-in-out;

    svg {
      color: inherit;
      transition: color 0s ease-in-out;
    }

    &:hover {
      color: var(--menu-items-color-hover);
    }
  }

  &__cart {
    position: relative;
  }

  a {
    display: flex;
    flex-direction: column;
    align-items: center;

    &.active {
      color: var(--menu-items-color-active);
    }
  }

  ul {
    display: flex;
    justify-content: space-between;
    width: 100%;

    button {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
