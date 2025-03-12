<template>
  <div>Product id: {{ $route.params.id }}</div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>
