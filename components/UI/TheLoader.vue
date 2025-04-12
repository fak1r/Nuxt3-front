<template>
  <div class="loader" role="status" aria-label="Загрузка...">
    <span :class="['loader__spinner', sizeClass]" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: 'sm' | 'md' | 'xl'
}>()

const sizeClass = computed(() => {
  return `loader__spinner--${props.size || 'md'}`
})
</script>

<style scoped lang="scss">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;

  &__spinner {
    width: 32px;
    height: 32px;
    border: 4px solid #ccc;
    border-top-color: #333;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;

    &--sm {
      width: 32px;
      height: 32px;
      border-width: 4px;
    }

    &--md {
      width: 48px;
      height: 48px;
      border-width: 6px;
    }

    &--xl {
      width: 64px;
      height: 64px;
      border-width: 6px;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
