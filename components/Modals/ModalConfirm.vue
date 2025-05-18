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
}

const { title } = defineProps<Props>()

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
    display: flex;
    justify-content: center;
  }

  &__btn {
    width: 100%;
  }
}
</style>
