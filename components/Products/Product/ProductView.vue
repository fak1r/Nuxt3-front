<template>
  <article class="product-view">
    <div v-if="hasImgs" class="gallery">
      <ImageSlider :images="product.images ?? []" />
    </div>

    <div class="info-card">
      <h1 class="info-card__title">{{ product.full_name }}</h1>

      <ul class="info-card__details">
        <li v-for="(value, key) in product.details" :key="key">
          <strong>{{ key }}:</strong> {{ value }}
        </li>
      </ul>
    </div>

    <div class="order-card">
      <p class="order-card__price">{{ product.price }} ₽</p>
      <div class="order-card__row">
        <div class="order-card__col">
          <TheButton @click="addToCart">В корзину</TheButton>
        </div>
        <div class="order-card__col">
          <TheQuantityInput v-if="isProductInCart" v-model="quantity" />
          <TheButton v-else variant="Secondary">Купить сейчас</TheButton>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '~/types/products.types'
import { useCartStore } from '~/store/cart'
import ImageSlider from '~/components/Products/Product/ImageSlider.vue'
import TheButton from '~/components/UI/TheButton.vue'
import TheQuantityInput from '~/components/UI/TheQuantityInput.vue'

interface Props {
  product: Product
}

const { product } = defineProps<Props>()

const cartStore = useCartStore()

const hasImgs = computed(() => product.images?.length)
const cartItem = computed(() => cartStore.items.find((item) => item.id === product.id))
const isProductInCart = computed(() => !!cartItem.value)
const quantity = computed({
  get() {
    return cartItem.value?.quantity || 0
  },
  set(value: number) {
    if (value < 1) {
      cartStore.removeFromCart(product.id)
    } else {
      cartStore.updateQuantity(product.id, value)
    }
  },
})

watch(quantity, (val) => {
  if (val < 1 && isProductInCart.value) {
    cartStore.removeFromCart(product.id)
  }
})

function addToCart() {
  if (!isProductInCart.value) {
    cartStore.addToCart(product, 1)
  }
}
</script>

<style scoped lang="scss">
.product-view {
  display: flex;
  gap: 8px;

  @include phone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .gallery {
    width: 100%;
    max-width: 40%;

    @include phone {
      max-width: 100%;
    }
  }

  .info-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border-radius: 16px;
    box-sizing: border-box;

    &__title {
      font-size: 24px;
      font-weight: 500;
    }

    &__details {
      font-size: 16px;
      line-height: 24px;
      gap: 4px;
      display: flex;
      flex-direction: column;
    }
  }

  .order-card {
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: fit-content;
    box-shadow:
      0 20px 12px -16px rgba(0, 30, 85, 0.1),
      0 8px 24px 18px rgba(0, 30, 85, 0.05);
    width: 400px;

    &__price {
      font-size: 20px;
      color: #000;
      font-weight: bold;
    }

    &__row {
      display: flex;
      gap: 4px;
      justify-content: center;
    }

    &__col {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;

      button {
        width: 100%;
      }
    }
  }
}
</style>
