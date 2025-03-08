<template>
  <nav class="mobile-nav" aria-label="Мобильная навигация">
    <ul>
      <li v-for="item in navItems" :key="item.to">
        <NuxtLink :to="item.to" active-class="active">
          <SvgIcons :icon="item.icon" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import SvgIcons from '~/components/Svg/SvgIcons.vue'

const navItems = [
  { to: '/', label: 'Главная', icon: 'home' },
  { to: '/catalog', label: 'Каталог', icon: 'catalog' },
  { to: '/cart', label: 'Корзина', icon: 'cart' },
  { to: '/profile', label: 'Профиль', icon: 'profile' },
]
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
  z-index: 9999;
  display: none;

  @include phone {
    display: flex;
  }

  ul {
    display: flex;
    justify-content: space-between;
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
    text-decoration: none;
    color: var(--general-text-color);

    .active {
      color: green;
    }
  }
}
</style>
