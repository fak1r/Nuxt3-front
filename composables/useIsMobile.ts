import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useIsMobile(breakpoint = 768) {
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
