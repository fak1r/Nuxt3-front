<template>
  <dialog class="overlay" @click.self="closeModal">
    <div class="modal">
      <button class="modal__close" aria-label="Закрыть" type="button" @click="closeModal">✕</button>

      <div class="modal__title">
        <h1>Заказ успешно оформлен!</h1>
      </div>

      <div class="modal__body">
        Мы уже передали его нашему продавцу — он лично получил вашу заявку и свяжется с вами в ближайшее рабочее
        время.<br />
        Ожидайте звонок или сообщение — большое спасибо за ваш заказ!
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useModalStore } from '~/store/modal'
import { useCartStore } from '~/store/cart'

const modalStore = useModalStore()
const cartStore = useCartStore()

async function closeModal() {
  cartStore.clearCart()
  modalStore.close()
  await navigateTo('/')
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

  &__error {
    color: red;
    font-size: 14px;
    margin-top: -10px;
  }
}
</style>
