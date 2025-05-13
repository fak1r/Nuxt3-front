<template>
  <section class="cart-page">
    <template v-if="hasProductsInCart">
      <h1 class="cart-page__title">Корзина</h1>

      <div class="cart-page__cards">
        <div class="cart-page__card">
          <div v-for="item in cartStore.items" :key="item.id" class="product">
            <div class="product__preview">
              <NuxtLink :to="item.self" class="product__image">
                <img :src="item.img_mini?.[0]" :alt="item.name" />
              </NuxtLink>

              <div class="product__info">
                <div class="product__content">
                  <NuxtLink :to="item.self" class="product__name">
                    {{ item.full_name }}
                  </NuxtLink>
                  <p class="product__price">{{ formatPrice(item.price) }} ₽</p>
                </div>
                <button type="button" class="product__remove" @click="removeProduct(item.id)">
                  <SvgIcons icon="trash-bin" />
                </button>
              </div>
            </div>

            <div class="product__quantity">
              <TheQuantityInput v-model="quantities[item.id]" :min-one="true" />
            </div>
          </div>
        </div>

        <div class="cart-page__card order-card">
          <div class="order-card__title">Ваша корзина</div>

          <div v-if="cartStore.totalItems > 0" class="order-card__summary">
            <p>Товары ({{ cartStore.totalItems }})</p>
            <p class="order-card__total">{{ formatPrice(cartStore.totalPrice) }} ₽</p>
          </div>

          <TheButton>Перейти к оформлению</TheButton>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="cart-page__card">
        <h1 class="cart-page__title">Корзина пуста</h1>
        <div class="cart-page__empty">Выберите товары или войдите в аккаунт, если добавляли товары в корзину</div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart'
import TheQuantityInput from '~/components/UI/TheQuantityInput.vue'
import SvgIcons from '~/components/Svg/SvgIcons.vue'
import TheButton from '~/components/UI/TheButton.vue'

const cartStore = useCartStore()

const { formatPrice } = usePriceFormat()

const quantities = reactive<Record<number, number>>({})

const hasProductsInCart = computed(() => cartStore.items.length !== 0)

cartStore.items.forEach((item) => {
  quantities[item.id] = item.quantity
})

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

function removeProduct(id: number) {
  if (confirm('Удалить товар? Вы точно хотите удалить выбранный товар? Отменить данное действие будет невозможно.')) {
    cartStore.removeFromCart(id)
  }
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
  }

  &__card {
    background-color: var(--white-color);
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: fit-content;
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
    }

    &__name {
      font-weight: 500;
      font-size: 16px;
    }

    &__price {
      font-size: 22px;
      font-weight: 500;
      color: #fe2722;
    }

    &__quantity {
      width: 100%;
      max-width: 160px;
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
