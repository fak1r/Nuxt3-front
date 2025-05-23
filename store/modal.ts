import { defineStore } from 'pinia'
import { useProductSearch } from '~/composables/useProductSearch'

export const useModalStore = defineStore('modal', () => {
  const { closeSearchRes } = useProductSearch()

  const state = reactive({
    modalType: null as 'auth' | 'catalog' | 'phone' | 'final' | 'confirm' | null,
  })

  function open(type: 'auth' | 'catalog' | 'phone' | 'final' | 'confirm') {
    closeSearchRes()
    state.modalType = type
  }

  function close() {
    state.modalType = null
  }

  const isAuthVisible = computed(() => state.modalType === 'auth')
  const isCatalogVisible = computed(() => state.modalType === 'catalog')
  const isPhoneModalVisible = computed(() => state.modalType === 'phone')
  const isModalOrderFinalVisible = computed(() => state.modalType === 'final')
  const isModalConfirmVisible = computed(() => state.modalType === 'confirm')

  return {
    state,
    open,
    close,
    isAuthVisible,
    isCatalogVisible,
    isPhoneModalVisible,
    isModalOrderFinalVisible,
    isModalConfirmVisible,
  }
})
