<template>
  <article class="product-card">
    <img :src="product.image_url || '/img/no-image.png'" alt="Фото товара" />
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
    <p>Цена: {{ product.price }} ₽</p>
    <p>В наличии: {{ product.stock }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  product: {
    id: number
    name: string
    description: string
    price: number
    stock: number
    image_url?: string
  }
}>()
</script>

<style scoped lang="scss">
.product-card {
  border: 1px solid var(--border);
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  height: 450px;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
}
</style>
