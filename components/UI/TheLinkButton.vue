<template>
  <NuxtLink class="link-button" :to="to">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  to: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.link-button {
  padding: 9px 20px;
  font-size: 16px;
  border-radius: 6px;
  background-color: var(--primary-btn);
  color: var(--white-color);
  text-decoration: none;

  &:hover {
    background-color: var(--primary-btn-hover);
  }
}
</style>
