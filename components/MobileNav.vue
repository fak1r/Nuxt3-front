<template>
  <nav class="mobile-nav" aria-label="Мобильная навигация">
    <ul>
      <li v-for="item in navItems" :key="item.to">
        <template v-if="item.type === 'link'">
          <NuxtLink :to="item.to" active-class="active">
            <SvgIcons :icon="item.icon" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>
        <template v-else>
          <button @click="openAuthModal">
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
import type { User } from '~/types/auth.types'

interface Emits {
  (e: 'open-auth-modal'): void
}

const emit = defineEmits<Emits>()

const authStore = useAuthStore()

const user = ref({} as User | null)
const hasUser = computed(() => !!user.value?.email)

const navItems = computed(() => [
  { to: '/', label: 'Главная', icon: 'home', type: 'link' },
  { to: '/catalog', label: 'Каталог', icon: 'catalog', type: 'link' },
  { to: '/cart', label: 'Корзина', icon: 'cart', type: 'link' },
  hasUser.value
    ? { to: '/profile', label: 'Профиль', icon: 'profile', type: 'link' }
    : { to: '#', label: 'Войти', icon: 'profile', type: 'button' },
])

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

  ul {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--general-text-color);

    .active {
      color: green;
    }
  }
}
</style>
