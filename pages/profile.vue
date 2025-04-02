<template>
  <div class="profile">
    <h1>Профиль</h1>
    <div class="profile__info">
      <span>Имя: {{ authStore.user?.name }}</span>
      <span>Email: {{ authStore.user?.email }}</span>
    </div>
    <button type="button" aria-label="Выйти из аккаунта" class="profile__logout" @click="logout">
      <SvgIcons icon="logout" />
      <span>Выйти из аккаунта</span>
    </button>
    <TheButton>Админка </TheButton>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import SvgIcons from '~/components/Svg/SvgIcons.vue'
import TheButton from '~/components/UI/TheButton.vue'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()

function logout() {
  authStore.logout()
  navigateTo('/')
}
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__logout {
    display: flex;
    align-items: center;
    color: var(--menu-items-color);
    transition: color 0.3s ease-in-out;

    svg {
      color: inherit;
      transition: color 0s ease-in-out;
      margin-right: 2px;
    }

    &:hover {
      color: var(--menu-items-color-hover) !important;
    }
  }
}
</style>
