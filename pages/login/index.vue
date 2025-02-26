<template>
  <div class="login-wrap">
    <transition :name="animDirection">
      <form :key="formType" class="login" @submit.prevent="onSubmitClick">
        <div class="login__title">
          <h1>{{ formTitle }}</h1>
        </div>

        <TheInput v-model="email" type="email" name="email" placeholder="Email" />
        <TheInput v-model="password" type="password" name="password" placeholder="Пароль" />

        <TheButton variant="Primary" type="submit">{{ formTitle }}</TheButton>

        <div class="login__info">
          {{ formText }}&nbsp;
          <span class="login__link" @click="onChangeFormTypeClick">
            {{ formLink }}
          </span>
        </div>
      </form>
    </transition>
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
const formType = ref('login')
const animDirection = ref('slide-left')

const formVariants = {
  login: {
    title: 'Вход',
    text: 'Нет аккаунта?',
    link: 'Регистрация',
  },
  register: {
    title: 'Регистрация',
    text: 'Есть аккаунт?',
    link: 'Вход',
  },
}

const formTitle = computed(() => formVariants[formType.value].title)
const formText = computed(() => formVariants[formType.value].text)
const formLink = computed(() => formVariants[formType.value].link)

function onChangeFormTypeClick() {
  animDirection.value = formType.value === 'login' ? 'slide-left' : 'slide-right'
  formType.value = formType.value === 'login' ? 'register' : 'login'
  email.value = ''
  password.value = ''
}

async function onSubmitClick() {
  let result
  if (formType.value === 'login') {
    result = await authStore.login(email.value, password.value)
  } else {
    //
  }
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

<style scoped lang="scss">
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  overflow: hidden;
}

.login {
  background-color: white;
  border: 1px solid var(--border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 400px;

  &__info {
    display: flex;
    justify-content: center;
  }

  &__link {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

.slide {
  &-right {
    &-enter-active {
      transition:
        transform 0.5s ease,
        opacity 0.5s ease;
    }

    &-leave-active {
      transition:
        transform 0.5s ease,
        opacity 0.5s ease;
      position: absolute;
    }

    &-enter-from {
      transform: translateX(-100%);
      opacity: 0;
    }

    &-leave-to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  &-left {
    &-enter-active {
      transition:
        transform 0.5s ease,
        opacity 0.5s ease;
    }

    &-leave-active {
      transition:
        transform 0.5s ease,
        opacity 0.5s ease;
      position: absolute;
    }

    &-enter-from {
      transform: translateX(100%);
      opacity: 0;
    }

    &-leave-to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
}
</style>
