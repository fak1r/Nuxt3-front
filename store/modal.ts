import { defineStore } from 'pinia'
import { useProductSearch } from '~/composables/useProductSearch'

export const useModalStore = defineStore('modal', () => {
  const { closeSearchRes } = useProductSearch()

  const state = reactive({
    modalType: null as 'auth' | 'catalog' | 'phone' | 'final' | 'confirm' | null,
    authRedirectPath: null as string | null,
  })

  function open(type: 'auth' | 'catalog' | 'phone' | 'final' | 'confirm') {
    closeSearchRes()
    state.modalType = type

    if (type !== 'auth') {
      state.authRedirectPath = null
    }
  }

  function openAuth(redirectPath: string | null = null) {
    closeSearchRes()
    state.authRedirectPath = redirectPath
    state.modalType = 'auth'
  }

  function close() {
    state.modalType = null
    state.authRedirectPath = null
  }

  const isAuthVisible = computed(() => state.modalType === 'auth')
  const isCatalogVisible = computed(() => state.modalType === 'catalog')
  const isPhoneModalVisible = computed(() => state.modalType === 'phone')
  const isModalOrderFinalVisible = computed(() => state.modalType === 'final')
  const isModalConfirmVisible = computed(() => state.modalType === 'confirm')
  const authRedirectPath = computed(() => state.authRedirectPath)

  return {
    state,
    open,
    openAuth,
    close,
    isAuthVisible,
    isCatalogVisible,
    isPhoneModalVisible,
    isModalOrderFinalVisible,
    isModalConfirmVisible,
    authRedirectPath,
  }
})
