import throttle from 'lodash/throttle'

export function useInfiniteScroll(callback: () => void) {
  function onScroll() {
    const scrollY = window.scrollY
    const viewportHeight = window.innerHeight
    const fullHeight = document.body.scrollHeight

    if (scrollY + viewportHeight + 200 >= fullHeight) {
      callback()
    }
  }

  const handleScroll = throttle(onScroll, 200)

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}
