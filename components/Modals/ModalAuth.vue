<template>
  <div class="overlay" @click.self="closeModal">
    <transition :name="animDirection">
      <form :key="formType" class="auth" @submit.prevent="onSubmitClick">
        <button class="auth__close" aria-label="Закрыть" type="button" @click="closeModal">✕</button>

        <div class="auth__title">
          <h1>{{ formTitle }}</h1>
        </div>

        <div class="auth__body">
          <template v-if="isFormTypeRegister">
            <TheInput
              v-model="name"
              type="text"
              name="name"
              placeholder="Имя"
              :error="errors.name"
              @focus="clearError('name')"
            />
          </template>

          <TheInput
            v-model="email"
            type="email"
            name="email"
            placeholder="Email"
            :error="errors.email"
            @focus="clearError('email')"
          />

          <TheInput
            v-model="password"
            type="password"
            name="password"
            placeholder="Пароль"
            :error="errors.password"
            @focus="clearError('password')"
          />

          <TheButton variant="Primary" type="submit">{{ formTitle }}</TheButton>
        </div>

        <div class="auth__info">
          {{ formText }}&nbsp;
          <button class="auth__link" type="button" @click="onChangeFormTypeClick">
            {{ formLink }}
          </button>
        </div>
      </form>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import TheInput from '~/components/UI/TheInput.vue'
import TheButton from '~/components/UI/TheButton.vue'
import type { FormType, FormVariants, FormErrors } from '~/types/auth.types'

interface Emits {
  (e: 'close-modal'): void
}

const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const name = ref('')
const errors = ref<FormErrors>({})
const formType = ref<FormType>('login')
const animDirection = ref('slide-left')

const formVariants: FormVariants = {
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

const isEmailValid = computed(() => /\S+@\S+\.\S+/.test(email.value))
const isPasswordValid = computed(() => password.value.length >= 6)
const isNameValid = computed(() => name.value.length > 1)
const isFormTypeRegister = computed(() => formType.value === 'register')

onBeforeMount(() => {
  if (authStore.accessToken) {
    navigateTo('/')
  }
})

function validateForm() {
  errors.value = {}
  if (!isEmailValid.value) errors.value.email = 'Некорректный email'
  if (!isPasswordValid.value) errors.value.password = 'Пароль должен быть минимум 6 символов'
  if (isFormTypeRegister.value && !isNameValid.value) errors.value.name = 'Имя должно содержать больше 1 символа'
  return Object.keys(errors.value).length === 0
}

function onChangeFormTypeClick() {
  animDirection.value = formType.value === 'login' ? 'slide-left' : 'slide-right'
  formType.value = formType.value === 'login' ? 'register' : 'login'
  email.value = ''
  password.value = ''
  errors.value = {}
}

function clearError(field: keyof FormErrors) {
  Reflect.deleteProperty(errors.value, field)
}

async function onSubmitClick() {
  if (!validateForm()) return

  let result
  if (isFormTypeRegister.value) {
    result = await authStore.register(name.value, email.value, password.value)
  } else {
    result = await authStore.login(email.value, password.value)
  }

  if (result) {
    navigateTo('/')
  }
}

function closeModal() {
  emit('close-modal')
}
</script>

<style scoped lang="scss">
.auth {
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  position: relative;
  background-color: var(--general-background-color);
  border: 1px solid var(--border);
  padding: 20px;
  display: flex;
  gap: 26px;
  width: 400px;
  height: fit-content;
  border-radius: 6px;

  &__close {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 20px;
    color: var(--primary-btn-hover);

    &:hover,
    &:focus {
      color: black;
    }

    &:focus-visible {
      outline: 2px solid var(--input-border-hover);
    }
  }

  &__info {
    display: flex;
    justify-content: center;
  }

  &__link {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
    text-underline-offset: 4px;
    border: none;
    background: none;
    font: inherit;
    padding: 0;

    &:focus-visible {
      outline: 2px solid var(--input-border-hover);
    }
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
