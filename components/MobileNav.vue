<template>
  <nav class="mobile-nav" aria-label="Мобильная навигация" role="menu">
    <ul>
      <li v-for="item in navItems" :key="item.to" role="menuItem">
        <template v-if="item.type === 'link'">
          <NuxtLink :to="item.to" class="mobile-nav__item" active-class="active">
            <SvgIcons :icon="item.icon" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>

        <template v-else>
          <button type="button" v-bind="authBtnStyle" class="mobile-nav__item" @click="openAuthModal">
            <SvgIcons :icon="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import SvgIcons from '~/components/Svg/SvgIcons.vue'
import { useAuthStore } from '@/store/auth'
import { useModalStore } from '~/store/modal'

const modalStore = useModalStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const hasUser = computed(() => !!user.value?.email)
const authBtnStyle = computed(() => ({ style: { color: modalStore.isAuthVisible ? 'black' : '' } }))

const navItems = computed(() => [
  { to: '/', label: 'Главная', icon: 'home', type: 'link' },
  { to: '/catalog', label: 'Каталог', icon: 'catalog', type: 'link' },
  { to: '/cart', label: 'Корзина', icon: 'cart', type: 'link' },
  hasUser.value
    ? { to: '/profile', label: 'Профиль', icon: 'profile', type: 'link' }
    : { to: '#', label: 'Войти', icon: 'profile', type: 'button' },
])

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
  display: none;

  @include phone {
    display: flex;
  }

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
