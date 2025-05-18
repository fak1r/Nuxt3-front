<!-- eslint-disable vue/no-v-html -->
<template>
  <article class="product-view" :class="{ 'product-view--no-gallery': !hasImgs }">
    <div v-if="hasImgs" class="gallery">
      <ImageSlider :images="product.images ?? []" />
    </div>

    <div class="info-wrap">
      <div class="info-card">
        <h1 class="info-card__title">{{ product.full_name }}</h1>

        <ul class="info-card__details">
          <li v-for="(value, key) in product.details" :key="key">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </ul>
      </div>
    </div>

    <div class="order-wrap">
      <div class="order-card">
        <p class="order-card__price">{{ formatPrice(product.price) }} ₽</p>
        <div class="order-card__row">
          <div class="order-card__col">
            <TheButton v-if="!isProductInCart" @click="addToCart">В корзину</TheButton>
            <TheButton v-else size="none" @click="goToCart">
              <div class="order-card__btn-label">
                <span>В корзине</span>
                <span class="order-card__btn-subtitle">Перейти</span>
              </div>
            </TheButton>
          </div>
          <div class="order-card__col">
            <TheQuantityInput v-if="isProductInCart" v-model="quantity" />
            <TheButton v-else variant="Secondary" @click="buyNow">Купить сейчас</TheButton>
          </div>
        </div>
      </div>
    </div>

    <ModalPhone v-if="modalStore.isPhoneModalVisible" @order="submitOrder($event, 'buy_now')" />
    <ModalOrderFinal
      v-if="modalStore.isModalOrderFinalVisible"
      :title="modalFinalTitle"
      :modal-type="modalFinalType"
      order-type="buy_now"
    >
      <template #default>
        <p v-html="modalFinalText" />
      </template>
    </ModalOrderFinal>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '~/types/products.types'
import { useCartStore } from '~/store/cart'
import { useModalStore } from '~/store/modal'
import ImageSlider from '~/components/Products/Product/ImageSlider.vue'
import TheButton from '~/components/UI/TheButton.vue'
import TheQuantityInput from '~/components/UI/TheQuantityInput.vue'
import ModalPhone from '~/components/Modals/ModalPhone.vue'
import ModalOrderFinal from '~/components/Modals/ModalOrderFinal.vue'

interface Props {
  product: Product
}

const { product } = defineProps<Props>()

const { formatPrice } = usePriceFormat()
const { submitOrder, modalFinalTitle, modalFinalText, modalFinalType } = useOrderSubmit()
const cartStore = useCartStore()
const modalStore = useModalStore()

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

async function buyNow() {
  cartStore.addToCart(product, 1)
  modalStore.open('phone')
}

function goToCart() {
  navigateTo('/cart')
}
</script>

<style scoped lang="scss">
.product-view {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-areas: 'gallery info order';
  gap: 8px;

  &--no-gallery {
    grid-template-columns: 1fr;
    grid-template-areas:
      'info'
      'order';
  }

  @media screen and (max-width: 1100px) {
    grid-template-columns: 2fr 1fr;
    grid-template-areas:
      'gallery info'
      'order order';

    &--no-gallery {
      grid-template-columns: 1fr;
      grid-template-areas:
        'info'
        'order';
    }
  }

  @include phone {
    grid-template-columns: 1fr;
    grid-template-areas:
      'gallery'
      'info'
      'order';
  }

  .gallery {
    grid-area: gallery;
  }

  .info-wrap {
    grid-area: info;
    display: flex;
    justify-content: center;
  }

  .info-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border-radius: 16px;
    box-sizing: border-box;

    @include phone {
      padding: 8px;
    }

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

  .order-wrap {
    grid-area: order;
    display: flex;
    justify-content: center;
  }

  .order-card {
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: fit-content;
    box-shadow:
      0 20px 12px -16px rgba(0, 30, 85, 0.1),
      0 8px 24px 18px rgba(0, 30, 85, 0.05);
    width: 400px;

    @media screen and (max-width: 1350px) {
      width: 320px;
    }

    @media screen and (max-width: 1100px) {
      width: 400px;
    }

    @media screen and (max-width: 450px) {
      width: 100%;
      padding: 8px;
    }

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

    &__btn-label {
      display: flex;
      flex-direction: column;
    }

    &__btn-subtitle {
      font-size: 12px;
      color: rgb(226, 226, 226);
    }
  }
}
</style>
