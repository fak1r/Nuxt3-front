import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  const state = reactive({
    modalType: null as 'auth' | 'catalog' | null,
  })

  function open(type: 'auth' | 'catalog') {
    state.modalType = type
  }

  function close() {
    state.modalType = null
  }

  const isAuthVisible = computed(() => state.modalType === 'auth')
  const isCatalogVisible = computed(() => state.modalType === 'catalog')

  return {
    state,
    open,
    close,
    isAuthVisible,
    isCatalogVisible,
  }
})
