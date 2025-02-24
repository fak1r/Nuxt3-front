<template>
  <div>
    <div class="header-container">
      <TheHeader />
    </div>
    <slot />
  </div>
</template>

<script setup>
import TheHeader from '~/components/TheHeader.vue'
</script>

<style scoped lang="scss">
.header-container {
  height: 64px;
}
</style>
