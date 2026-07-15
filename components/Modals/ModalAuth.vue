<template>
  <dialog class="overlay">
    <transition :name="animDirection">
      <form :key="formType" class="modal" @submit.prevent="submitForm">
        <button class="modal__close" aria-label="Закрыть" type="button" @click="closeModal">✕</button>

        <div class="modal__title">
          <h1>{{ formTitle }}</h1>
        </div>

        <div class="modal__body">
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

          <TheButton class="modal__btn" variant="Primary" type="submit">{{ formTitle }}</TheButton>
        </div>

        <div class="modal__info">
          {{ formText }}&nbsp;
          <button class="link" type="button" @click="changeFormType">
            {{ formLink }}
          </button>
        </div>
      </form>
    </transition>
  </dialog>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { useModalStore } from '~/store/modal'
import TheInput from '~/components/UI/TheInput.vue'
import TheButton from '~/components/UI/TheButton.vue'
import type { FormType, FormVariants, FormErrors } from '~/types/auth.types'
import { getSafeRouteRedirect } from '~/utils/get-safe-route-redirect'

const authStore = useAuthStore()
const modalStore = useModalStore()
const route = useRoute()

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
const redirectAfterAuth = computed(() => getSafeRouteRedirect(route.query.redirect, '/profile'))

onBeforeMount(() => {
  if (authStore.accessToken) {
    navigateTo(redirectAfterAuth.value, { replace: true })
  }
})

function validateForm() {
  errors.value = {}
  if (!isEmailValid.value) errors.value.email = 'Некорректный email'
  if (!isPasswordValid.value) errors.value.password = 'Пароль должен быть минимум 6 символов'
  if (isFormTypeRegister.value && !isNameValid.value) errors.value.name = 'Имя должно содержать больше 1 символа'
  return Object.keys(errors.value).length === 0
}

function changeFormType() {
  animDirection.value = formType.value === 'login' ? 'slide-left' : 'slide-right'
  formType.value = formType.value === 'login' ? 'register' : 'login'
  email.value = ''
  password.value = ''
  errors.value = {}
}

function clearError(field: keyof FormErrors) {
  Reflect.deleteProperty(errors.value, field)
}

async function submitForm() {
  if (!validateForm()) return

  const result = isFormTypeRegister.value
    ? await authStore.register(name.value, email.value, password.value)
    : await authStore.login(email.value, password.value)

  if (!result.ok) {
    errors.value = { ...(result.errors || {}) }
    return
  }

  modalStore.close()
  await navigateTo(redirectAfterAuth.value, { replace: true })
}

async function closeModal() {
  modalStore.close()

  if (!('auth' in route.query)) {
    return
  }

  const nextQuery = { ...route.query }

  Reflect.deleteProperty(nextQuery, 'auth')
  Reflect.deleteProperty(nextQuery, 'redirect')

  await navigateTo(
    {
      path: route.path,
      query: nextQuery,
    },
    { replace: true },
  )
}
</script>

<style scoped lang="scss">
.modal {
  &__info {
    display: flex;
    justify-content: center;
  }

  &__btn {
    width: 100%;
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
