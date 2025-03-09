<template>
  <div class="overlay" @click.self="closeModal">
    <div class="catalog-modal">CATALOG MODAL</div>
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
.catalog-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1001;
}
</style>
