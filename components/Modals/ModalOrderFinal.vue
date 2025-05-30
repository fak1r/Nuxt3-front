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

interface Props {
  title: string
  modalType: 'success' | 'error'
  orderType?: 'buy_now' | 'cart'
}

const { title, modalType, orderType = 'cart' } = defineProps<Props>()

const modalStore = useModalStore()

function closeModal() {
  modalStore.close()
  if (modalType === 'success') {
    if (orderType === 'cart') {
      navigateTo('/')
    }
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
