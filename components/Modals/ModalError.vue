<template>
  <dialog class="overlay" @click.self="closeModal">
    <div class="modal">
      <button class="modal__close" aria-label="Закрыть" type="button" @click="closeModal">✕</button>

      <div class="modal__title">
        <h1>Произошла ошибка</h1>
      </div>

      <div class="modal__body">
        К сожалению, нам не удалось обработать ваш заказ😔<br />
        Вы можете попробовать снова или связаться с продавцом для оформления по телефону
        <br /><span class="link-default">+7 (910) 414-35-67</span> Александр
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useModalStore } from '~/store/modal'

const modalStore = useModalStore()

function closeModal() {
  modalStore.close()
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
