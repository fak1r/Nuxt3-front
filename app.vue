<script setup lang="ts">
const config = useRuntimeConfig()
const counterId = Number(config.public.metrikaId)
const metrikaWatchUrl =
  Number.isSafeInteger(counterId) && counterId > 0 ? `https://mc.yandex.ru/watch/${counterId}` : null
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <noscript v-if="metrikaWatchUrl">
    <div>
      <img :src="metrikaWatchUrl" style="position: absolute; left: -9999px" alt="" />
    </div>
  </noscript>
</template>
