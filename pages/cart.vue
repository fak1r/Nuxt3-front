<!-- eslint-disable vue/no-v-html -->
<template>
  <section class="cart-page">
    <template v-if="hasProductsInCart && cartReady">
      <h1 class="cart-page__title">Корзина</h1>

      <div class="cart-page__cards">
        <div class="cart-page__card">
          <div v-for="item in cartStore.items" :key="item.id" class="product">
            <div class="product__preview">
              <NuxtLink :to="item.self" class="product__image">
                <img :src="item.img_mini?.[0] ?? '/img/no-image.png'" :alt="item.name" />
              </NuxtLink>

              <div class="product__info">
                <div class="product__content">
                  <NuxtLink :to="item.self" class="product__name">
                    {{ item.full_name ? item.full_name : item.name }}
                  </NuxtLink>
                  <p class="product__price">{{ formatPrice(item.price) }} ₽</p>
                </div>
                <div class="product__row">
                  <div class="product__quantity-info">
                    <TheQuantityInput v-if="quantities[item.id]" v-model="quantities[item.id]" :min-one="true" />
                  </div>
                  <button type="button" class="product__remove" @click="openRemoveModal(item.id)">
                    <SvgIcons icon="trash-bin" />
                  </button>
                </div>
              </div>
            </div>

            <div class="product__quantity">
              <TheQuantityInput v-if="quantities[item.id]" v-model="quantities[item.id]" :min-one="true" />
            </div>
          </div>
        </div>

        <div class="cart-page__card order-card">
          <div class="order-card__title">Ваша корзина</div>

          <div v-if="cartStore.totalItems > 0" class="order-card__summary">
            <p>Товары ({{ cartStore.totalItems }})</p>
            <p class="order-card__total">{{ formatPrice(cartStore.totalPrice) }} ₽</p>
          </div>

          <TheButton @click="openPhoneModal">Перейти к оформлению</TheButton>
        </div>
      </div>
    </template>

    <template v-else-if="cartReady">
      <div class="cart-page__card">
        <h1 class="cart-page__title">Корзина пуста</h1>
        <div class="cart-page__empty">Выберите товары или войдите в аккаунт, если добавляли товары в корзину</div>
      </div>
    </template>

    <template v-else>
      <TheLoader size="xl" />
    </template>

    <ModalPhone v-if="modalStore.isPhoneModalVisible" @order="submitOrder" />
    <ModalOrderFinal v-if="modalStore.isModalOrderFinalVisible" :title="modalFinalTitle" :modal-type="modalFinalType">
      <template #default>
        <p v-html="modalFinalText" />
      </template>
    </ModalOrderFinal>
    <ModalConfirm v-if="modalStore.isModalConfirmVisible" title="Удалить товар?">
      <template #default>
        <TheButton @click="removeProduct">Удалить</TheButton>
      </template>
    </ModalConfirm>
  </section>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart'
import { useModalStore } from '~/store/modal'
import TheQuantityInput from '~/components/UI/TheQuantityInput.vue'
import SvgIcons from '~/components/Svg/SvgIcons.vue'
import TheButton from '~/components/UI/TheButton.vue'
import TheLoader from '~/components/UI/TheLoader.vue'
import ModalPhone from '~/components/Modals/ModalPhone.vue'
import ModalOrderFinal from '~/components/Modals/ModalOrderFinal.vue'
import ModalConfirm from '~/components/Modals/ModalConfirm.vue'

const { submitOrder, modalFinalTitle, modalFinalText, modalFinalType } = useOrderSubmit()
const { formatPrice } = usePriceFormat()
const cartStore = useCartStore()
const modalStore = useModalStore()

const quantities = reactive<Record<number, number>>({})

const hasProductsInCart = computed(() => cartStore.items.length !== 0)

const cartReady = ref(false)
const removeProductId = ref(0)

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

onMounted(() => {
  cartStore.items.forEach((item) => {
    quantities[item.id] = item.quantity
  })
  cartReady.value = true
})

function openPhoneModal() {
  modalStore.open('phone')
}

function openRemoveModal(id: number) {
  removeProductId.value = id
  modalStore.open('confirm')
}

function removeProduct() {
  cartStore.removeFromCart(removeProductId.value)
  removeProductId.value = 0
  modalStore.close()
}
</script>

<style scoped lang="scss">
.cart-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__title {
    font-size: 24px;
  }

  &__empty {
    font-size: 16px;
    color: gray;
  }

  &__cards {
    gap: 16px;
    display: grid;
    grid-template-columns: 2fr 1fr;

    @media screen and (max-width: 900px) {
      display: flex;
      flex-direction: column;
    }
  }

  &__card {
    background-color: var(--white-color);
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: fit-content;

    @include phone {
      padding: 8px;
    }
  }

  .product {
    display: flex;
    border-radius: 8px;
    justify-content: space-between;
    width: 100%;

    &__preview {
      display: flex;
      gap: 16px;
    }

    &__image {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120px;

      img {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
      justify-content: space-between;
      margin-right: 16px;
    }

    &__name {
      font-weight: 500;
      font-size: 18px;

      @include phone {
        font-size: 16px;
      }
    }

    &__price {
      font-size: 22px;
      font-weight: 500;
      color: #fe2722;

      @include phone {
        font-size: 20px;
      }
    }

    &__quantity {
      width: 100%;
      max-width: 160px;

      @include phone {
        display: none;
      }
    }

    &__quantity-info {
      display: none;
      width: 100%;
      max-width: 160px;

      @include phone {
        display: flex;
      }
    }

    &__row {
      display: flex;
      gap: 8px;
      width: 100%;
    }

    &__remove {
      color: var(--menu-items-color);

      &:hover {
        color: var(--menu-items-color-hover);
      }
    }
  }

  .order-card {
    &__title {
      font-weight: bold;
      font-size: 22px;
    }

    &__summary {
      width: 100%;
      display: flex;
      justify-content: space-between;

      p {
        width: fit-content;
      }
    }

    &__total {
      font-weight: bold;
      font-size: 22px;
    }
  }
}
</style>
