<!-- eslint-disable vue/no-v-html -->
<template>
  <article class="product-view" :class="{ 'product-view--no-gallery': !hasImgs }">
    <div v-if="hasImgs" class="gallery">
      <ImageSlider :images="product.images ?? []" />
    </div>

    <div class="info-wrap">
      <div class="info-card">
        <h1 class="info-card__title">{{ product.full_name }}</h1>

        <section v-if="hasDetails" class="info-card__details" aria-labelledby="details-title">
          <h2 id="details-title">Характеристики</h2>

          <dl class="info-card__list">
            <template v-for="(value, key) in product.details" :key="key">
              <template v-if="key !== 'Описание'">
                <div class="info-card__row">
                  <dt class="info-card__item">{{ key }}:</dt>
                  <dd class="info-card__item">{{ value }}</dd>
                </div>
              </template>
            </template>
          </dl>
        </section>
      </div>
    </div>

    <div class="order-wrap">
      <div class="order-card">
        <p class="order-card__price">{{ formatPrice(product.price) }} ₽</p>
        <div class="order-card__row">
          <div class="order-card__col">
            <TheButton v-if="!isProductInCart" @click="addToCart">В корзину</TheButton>
            <TheButton v-else @click="goToCart">
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

    <section v-if="product.details?.['Описание']" class="product-description" aria-labelledby="description-title">
      <h2 id="description-title">Описание</h2>
      <p v-html="product.details['Описание']" />
    </section>

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
const detailsWithoutDescription = computed(() => {
  return Object.fromEntries(Object.entries(product.details || {}).filter(([key]) => key !== 'Описание'))
})
const hasDetails = computed(() => Object.keys(detailsWithoutDescription.value).length > 0)

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
  grid-template-areas:
    'gallery info order'
    'description description description';
  gap: 8px;

  &--no-gallery {
    grid-template-columns: 1fr;
    grid-template-areas:
      'info'
      'order';
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 2fr 1fr;
    grid-template-areas:
      'gallery info'
      'order order'
      'description description';

    &--no-gallery {
      grid-template-columns: 1fr;
      grid-template-areas:
        'info'
        'order'
        'description';
    }
  }

  @include phone {
    grid-template-columns: 1fr;
    grid-template-areas:
      'gallery'
      'info'
      'order'
      'description';
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
      padding: 0;
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

    &__list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__row {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    &__item {
      margin: 0;

      &:first-child {
        font-weight: bold;
        min-width: 190px;
      }
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

    @media screen and (max-width: 1200px) {
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

  .product-description {
    grid-area: description;
    display: flex;
    flex-direction: column;
    gap: 8px;

    p {
      line-height: 1.6;
    }
  }
}
</style>
