import { useCartStore } from '~/store/cart'
import { useModalStore } from '~/store/modal'

export function useOrderSubmit() {
  const cartStore = useCartStore()
  const modalStore = useModalStore()
  const { $axios } = useNuxtApp()

  const modalFinalTitle = ref('')
  const modalFinalText = ref('')
  const modalFinalType: Ref<'success' | 'error'> = ref('error')

  async function sendTelegramOrder(
    phone: string,
    source: 'buy_now' | 'cart' = 'cart',
  ): Promise<{ success: boolean; order_id?: number }> {
    const payload = {
      phone,
      source,
      items: cartStore.items.map(function (item) {
        return {
          id: item.id,
          full_name: item.full_name || item.name,
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

  async function submitOrder(phone: string, source: 'buy_now' | 'cart' = 'cart') {
    const result = await sendTelegramOrder(phone, source)
    if (result.success) {
      cartStore.clearCart()
      addModalContent('success', result.order_id)
    } else {
      addModalContent('error')
    }
    modalStore.open('final')
  }

  function addModalContent(modalType: 'success' | 'error', orderNumber?: number) {
    if (modalType === 'success') {
      modalFinalType.value = 'success'
      modalFinalTitle.value = `Заказ №${orderNumber ? orderNumber : '404'} успешно оформлен!`
      modalFinalText.value = `Мы передали его нашему продавцу — он уже получил всю информацию и свяжется с вами в ближайшее рабочее время<br />😊<br /> Ожидайте звонок или сообщение<br /> Большое спасибо за ваш заказ!`
    } else {
      modalFinalType.value = 'error'
      modalFinalTitle.value = 'Произошла ошибка'
      modalFinalText.value = `К сожалению, нам не удалось обработать ваш заказ<br />😔<br /> Вы можете попробовать снова или связаться с продавцом для оформления по телефону <br /><span class="link">+7 (910) 414-35-67</span> Александр`
    }
  }

  return {
    sendTelegramOrder,
    submitOrder,
    modalFinalTitle,
    modalFinalText,
    modalFinalType,
  }
}
