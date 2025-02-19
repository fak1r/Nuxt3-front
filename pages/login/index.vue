<template>
  <div class="login-wrap">
    <div class="login">
      <div class="login__title">
        <h1>Login</h1>
      </div>

      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Пароль" />
      <button @click="handleLogin">Войти</button>
      <button @click="handleAdmin">Админ</button>
      <button @click="clearRefresh">clearRefresh</button>
      <button @click="clearAccess">clearAccess</button>

      <NuxtLink to="/">Main page</NuxtLink>
      <NuxtLink to="/admin">Admin Pannel</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
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

function clearRefresh() {
  console.log('authStore.refreshToken', authStore.refreshToken)
  authStore.refreshToken = null
  console.log('authStore.refreshToken', authStore.refreshToken)
}
function clearAccess() {
  console.log('authStore.accessToken', authStore.accessToken)
  authStore.accessToken = null
  console.log('authStore.accessToken', authStore.accessToken)
}
</script>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  border: 1px solid #000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 400px;
}
</style>
