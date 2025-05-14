import { defineStore } from 'pinia'
import type { Product } from '~/types/products.types'

export type CartItem = Product & { quantity: number }

export const useCartStore = defineStore('cart', () => {
  const items = reactive<CartItem[]>([])

  const totalItems = computed(function () {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPositions = computed(function () {
    return items.length
  })

  const totalPrice = computed(function () {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  })

  function addToCart(product: Product, quantity = 1) {
    const existing = items.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.push({ ...product, quantity })
    }
  }

  function removeFromCart(productId: number) {
    const index = items.findIndex((item) => item.id === productId)
    if (index !== -1) items.splice(index, 1)
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.find((i) => i.id === productId)
    if (item) item.quantity = quantity
  }

  function clearCart() {
    items.splice(0, items.length)
  }

  onMounted(() => {
    const savedProducts = localStorage.getItem('cart')
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts)
        if (Array.isArray(parsed)) {
          items.splice(0, items.length, ...parsed)
        }
      } catch (err) {
        console.warn('Ошибка чтения корзины из localStorage', err)
      }
    }
  })

  watch(
    items,
    (newItems) => {
      localStorage.setItem('cart', JSON.stringify(newItems))
    },
    { deep: true },
  )

  return {
    items,
    totalItems,
    totalPositions,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
})
