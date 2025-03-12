<template>
  <div class="overlay overlay--mt" @click.self="closeModal">
    <div class="catalog">CATALOG MODAL</div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'close-modal'): void
}

const emit = defineEmits<Emits>()

function closeModal() {
  emit('close-modal')
}
</script>

<style scoped lang="scss">
.overlay--mt {
  margin-top: var(--header-height);
}
.catalog {
  position: fixed;
  left: 50%;
  top: var(--header-height);
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  overflow: hidden;
  box-shadow:
    0 2px 2px 0 #445c821f,
    -1px 4px 10px 0 #445c821a,
    0 -2px 10px 0 #445c820d;
  z-index: 1001;
  width: 100%;
  max-width: var(--max-page-width);
  height: 80%;
  background-color: var(--general-background-color);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  &__close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 20px;
    color: var(--primary-btn-hover);

    &:hover,
    &:focus {
      color: black;
    }
  }
}
</style>
