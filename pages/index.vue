<template>
  <div class="main-page-wrap">
    <h1>Main page</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<style scoped lang="scss"></style>
