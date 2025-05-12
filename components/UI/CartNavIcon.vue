<template>
  <div class="cart-icon">
    <SvgIcons icon="cart" />
    <span v-if="totalItems > 0" class="cart-icon__badge">{{ totalItems }}</span>
  </div>
  <span>Корзина</span>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart'

const cartStore = useCartStore()

const totalItems = computed(function () {
  return cartStore.totalPositions
})
</script>

<style scoped lang="scss">
.cart-icon {
  &__badge {
    position: absolute;
    top: -4px;
    right: -6px;
    background-color: var(--primary-btn);
    color: var(--white-color);
    font-size: 10px;
    font-weight: 500;
    padding: 1px 5px;
    border-radius: 10px;
    text-align: center;

    @include phone {
      top: 0;
    }
  }
}
</style>
