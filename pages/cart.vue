<template>
  <section class="cart">
    <h1 class="cart__title">Корзина</h1>

    <div v-if="hasProductsInCart" class="cart__empty">Ваша корзина пуста</div>

    <div v-else class="cart__list">
      <div v-for="item in cartStore.items" :key="item.id" class="cart__item">
        <NuxtLink :to="item.self" class="cart__image">
          <img :src="item.img_mini?.[0]" :alt="item.name" />
        </NuxtLink>

        <div class="cart__info">
          <NuxtLink :to="item.self" class="cart__name">
            {{ item.full_name }}
          </NuxtLink>
          <p class="cart__price">{{ item.price }} ₽ / шт</p>
          <TheQuantityInput v-model="quantities[item.id]" :min-one="true" />
          <p class="cart__total">{{ item.price * quantities[item.id] }} ₽</p>
        </div>

        <button class="cart__remove" @click="remove(item.id)">✕</button>
      </div>
    </div>

    <div v-if="cartStore.totalItems > 0" class="cart__summary">
      <p>Товаров: {{ cartStore.totalItems }}</p>
      <p>Итого: {{ cartStore.totalPrice }} ₽</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart'
import TheQuantityInput from '~/components/UI/TheQuantityInput.vue'

const cartStore = useCartStore()

const quantities = reactive<Record<number, number>>({})

const hasProductsInCart = computed(() => cartStore.items.length === 0)
// Инициализация кол-ва из стора
cartStore.items.forEach((item) => {
  quantities[item.id] = item.quantity
})

// Следим за изменениями и обновляем store
watch(
  quantities,
  (newVal) => {
    for (const [idStr, qty] of Object.entries(newVal)) {
      const id = Number(idStr)
      if (qty > 0) {
        cartStore.updateQuantity(id, qty)
      } else {
        cartStore.removeFromCart(id)
      }
    }
  },
  { deep: true },
)

function remove(id: number) {
  cartStore.removeFromCart(id)
}
</script>

<style scoped lang="scss">
.cart {
  padding: 16px;

  &__title {
    font-size: 24px;
    margin-bottom: 16px;
  }

  &__empty {
    font-size: 16px;
    text-align: center;
    color: gray;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__item {
    display: flex;
    gap: 16px;
    align-items: center;
    border: 1px solid var(--border);
    padding: 12px;
    border-radius: 8px;
    position: relative;
  }

  &__image img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 8px;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__name {
    font-weight: 500;
    font-size: 16px;
    color: var(--text);
  }

  &__price,
  &__total {
    font-size: 14px;
    color: #666;
  }

  &__remove {
    position: absolute;
    right: 12px;
    top: 12px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #888;

    &:hover {
      color: #000;
    }
  }

  &__summary {
    margin-top: 24px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
