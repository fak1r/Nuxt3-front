<template>
  <dialog class="overlay" @click.self="closeModal">
    <form class="modal" @submit.prevent="submitForm">
      <button class="modal__close" aria-label="Закрыть" type="button" @click="closeModal">✕</button>

      <div class="modal__title">
        <h1>Телефон для связи</h1>
      </div>

      <div class="modal__body">
        <TheInput
          v-model="phone"
          type="text"
          name="phone"
          placeholder="Телефон"
          :error="errors.phone"
          :is-phone="true"
          @focus="clearError('phone')"
        />

        <TheButton class="modal__btn" variant="Primary" type="submit">Оформить заказ</TheButton>
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { useModalStore } from '~/store/modal'
import TheInput from '~/components/UI/TheInput.vue'
import TheButton from '~/components/UI/TheButton.vue'
import type { FormErrors } from '~/types/auth.types'

interface Emits {
  (e: 'order', phone: string): void
}

const emit = defineEmits<Emits>()
const modalStore = useModalStore()

const phone = ref('')
const errors = ref<FormErrors>({})

const isPhoneValid = computed(() => /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone.value))

function validateForm() {
  errors.value = {}
  if (!isPhoneValid.value) {
    errors.value.phone = 'Введите корректный номер'
  }
  return Object.keys(errors.value).length === 0
}

function clearError(field: keyof FormErrors) {
  Reflect.deleteProperty(errors.value, field)
}

async function submitForm() {
  if (!validateForm()) return
  closeModal()
  emit('order', normalizePhone(phone.value))
}

function closeModal() {
  modalStore.close()
}

function normalizePhone(phone: string): string {
  const normilized = phone.replace(/\D/g, '').slice(-10)
  return `+7${normilized}`
}
</script>

<style scoped lang="scss">
.modal {
  &__title {
    text-align: center;
  }

  &__btn {
    width: 100%;
  }

  &__error {
    color: red;
    font-size: 14px;
    margin-top: -10px;
  }
}
</style>
