<template>
  <div class="skeleton">
    <div class="skeleton__image" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.skeleton {
  animation: pulse 1.5s infinite ease-in-out;
  pointer-events: none;
  user-select: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &__image {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: var(--skeleton-color);
    border-radius: 8px;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
