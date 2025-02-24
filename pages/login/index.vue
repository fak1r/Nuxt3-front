<template>
  <div class="login-wrap">
    <div class="login">
      <div class="login__title">
        <h1>Login</h1>
      </div>

      <TheInput v-model="email" type="email" placeholder="Email" />
      <TheInput v-model="password" type="password" placeholder="Пароль" />

      <TheButton variant="Primary">Вход</TheButton>
      <TheButton variant="Secondary">Регистрация</TheButton>
      <button @click="handleLogin">Войти</button>
      <button @click="handleAdmin">Админ</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import TheInput from '~/components/UI/TheInput.vue'
import TheButton from '~/components/UI/TheButton.vue'

const { $axios } = useNuxtApp()

const authStore = useAuthStore()
const email = ref('')
const password = ref('')

async function handleLogin() {
  const result = await authStore.login(email.value, password.value)
  console.log('🔹 Response Data:', result)
  if (result) {
    navigateTo('/')
  }
}
async function handleAdmin() {
  const res = await $axios.get('/admin')
  console.log('res', res)
}
</script>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}

.login {
  background-color: white;
  border: 1px solid var(--border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 400px;
}
</style>
