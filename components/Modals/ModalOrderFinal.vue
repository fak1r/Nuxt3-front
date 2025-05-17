<template>
  <dialog class="overlay" @click.self="closeModal">
    <div class="modal">
      <button class="modal__close" aria-label="Закрыть" type="button" @click="closeModal">✕</button>

      <div class="modal__title">
        <h1>{{ title }}</h1>
      </div>

      <div class="modal__body">
        <slot />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useModalStore } from '~/store/modal'
import { useCartStore } from '~/store/cart'

interface Props {
  title: string
  modalType: 'success' | 'error'
}

const { title, modalType } = defineProps<Props>()

const modalStore = useModalStore()
const cartStore = useCartStore()

function closeModal() {
  modalStore.close()
  if (modalType === 'success') {
    navigateTo('/')
    cartStore.clearCart()
  }
}
</script>

<style scoped lang="scss">
.modal {
  &__title {
    text-align: center;
    margin-right: 20px;
  }

  &__body {
    text-align: center;
    font-size: 16px;
  }

  &__btn {
    width: 100%;
  }
}
</style>
