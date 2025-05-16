import { defineStore } from 'pinia'
import { useProductSearch } from '~/composables/useProductSearch'

export const useModalStore = defineStore('modal', () => {
  const { closeSearchRes } = useProductSearch()

  const state = reactive({
    modalType: null as 'auth' | 'catalog' | 'phone' | 'success' | 'error' | null,
  })

  function open(type: 'auth' | 'catalog' | 'phone' | 'success' | 'error') {
    closeSearchRes()
    state.modalType = type
  }

  function close() {
    state.modalType = null
  }

  const isAuthVisible = computed(() => state.modalType === 'auth')
  const isCatalogVisible = computed(() => state.modalType === 'catalog')
  const isPhoneModalVisible = computed(() => state.modalType === 'phone')
  const isSuccessModalVisible = computed(() => state.modalType === 'success')
  const isErrorModalVisible = computed(() => state.modalType === 'error')

  return {
    state,
    open,
    close,
    isAuthVisible,
    isCatalogVisible,
    isPhoneModalVisible,
    isSuccessModalVisible,
    isErrorModalVisible,
  }
})
