export function useIsMobile(breakpoint = 767) {
  const isMobile = ref(false)

  function update() {
    isMobile.value = window.innerWidth <= breakpoint
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update)
  })

  return { isMobile }
}
