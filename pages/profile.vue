<template>
  <div v-if="isCheckingAccess" class="profile profile--loading">Проверяем доступ...</div>
  <div v-else-if="canRenderPage" class="profile">
    <h1>Профиль</h1>
    <div class="profile__info">
      <span>Имя: {{ authStore.user?.name }}</span>
      <span>Email: {{ authStore.user?.email }}</span>
    </div>

    <button type="button" aria-label="Выйти из аккаунта" class="profile__logout" @click="logout">
      <SvgIcons icon="logout" />
      <span>Выйти из аккаунта</span>
    </button>

    <ClientOnly>
      <TheButton v-if="authStore.isAuthenticated && authStore.isAdmin" @click="navigateTo(normalizeInternalPath('/admin'))"
        >Админка</TheButton
      >
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import SvgIcons from '~/components/Svg/SvgIcons.vue'
import TheButton from '~/components/UI/TheButton.vue'
import { normalizeInternalPath } from '~/utils/get-safe-route-redirect'

const authStore = useAuthStore()
const { isCheckingAccess, canRenderPage } = useProtectedPage()

useHead({
  title: 'Профиль | Зам Пол',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

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

  &--loading {
    text-align: center;
  }

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
