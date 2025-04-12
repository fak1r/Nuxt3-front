<template>
  <div class="skeleton">
    <div class="skeleton__image" />
    <div class="skeleton__title" />
    <div class="skeleton__price" />
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
    aspect-ratio: 1 / 0.8;
    background-color: #e0e0e0;
    border-radius: 8px;
  }

  &__title {
    width: 70%;
    height: 16px;
    background-color: #e0e0e0;
    border-radius: 4px;
    margin-top: 12px;
  }

  &__price {
    width: 40%;
    height: 14px;
    background-color: #e0e0e0;
    border-radius: 4px;
    margin-top: 8px;
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
