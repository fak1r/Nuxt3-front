import { useCartStore } from '~/store/cart'

export function useOrderSubmit() {
  const cartStore = useCartStore()
  const { $axios } = useNuxtApp()

  async function sendTelegramOrder(phone: string): Promise<{ success: boolean; order_number?: number }> {
    const payload = {
      phone,
      items: cartStore.items.map(function (item) {
        return {
          id: item.id,
          name: item.full_name || item.name,
          quantity: item.quantity,
          price: item.price,
        }
      }),
    }

    try {
      const response = await $axios.post('/order/telegram', payload)
      return response.data
    } catch (error) {
      console.error('Ошибка отправки заказа в Telegram:', error)
      return { success: false }
    }
  }

  return { sendTelegramOrder }
}
