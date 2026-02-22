import throttle from 'lodash/throttle'

interface UseAutoloadUntilScrollableOptions {
  hasMore: Readonly<Ref<boolean>>
  isLoading: Readonly<Ref<boolean>>
  itemsCount: Readonly<Ref<number>>
  onLoadMore: () => void
  offset?: number
  throttleMs?: number
}

export function useAutoloadUntilScrollable({
  hasMore,
  isLoading,
  itemsCount,
  onLoadMore,
  offset = 200,
  throttleMs = 200,
}: UseAutoloadUntilScrollableOptions) {
  function getPageHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
  }

  function loadMoreIfViewportNotFilled() {
    if (!import.meta.client) return
    if (isLoading.value || !hasMore.value) return

    const isScrollable = getPageHeight() > window.innerHeight + offset
    if (!isScrollable) {
      onLoadMore()
    }
  }

  const handleResize = throttle(loadMoreIfViewportNotFilled, throttleMs)

  watch(
    () => [itemsCount.value, isLoading.value, hasMore.value],
    async () => {
      await nextTick()
      loadMoreIfViewportNotFilled()
    },
    { flush: 'post' },
  )

  onMounted(async () => {
    window.addEventListener('resize', handleResize, { passive: true })
    await nextTick()
    loadMoreIfViewportNotFilled()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    handleResize.cancel()
  })
}
