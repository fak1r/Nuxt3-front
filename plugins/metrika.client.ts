type YandexMetrika = ((...args: unknown[]) => void) & {
  a?: unknown[][]
  l?: number
}

declare global {
  interface Window {
    ym?: YandexMetrika
  }
}

function getCounterId(value: unknown): number | null {
  const counterId = Number(value)

  return Number.isSafeInteger(counterId) && counterId > 0 ? counterId : null
}

function getMetrika(): YandexMetrika {
  if (window.ym) return window.ym

  const metrika = ((...args: unknown[]) => {
    metrika.a?.push(args)
  }) as YandexMetrika

  metrika.a = []
  metrika.l = Date.now()
  window.ym = metrika

  return metrika
}

function loadMetrikaTag(counterId: number): void {
  const scriptId = `yandex-metrika-tag-${counterId}`

  if (document.getElementById(scriptId)) return

  const script = document.createElement('script')
  script.id = scriptId
  script.async = true
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`
  document.head.append(script)
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const counterId = getCounterId(config.public.metrikaId)

  if (!counterId) return

  const metrika = getMetrika()
  const router = useRouter()
  let lastTrackedUrl = ''
  let referrer = document.referrer

  function trackPageView(): void {
    void nextTick(() => {
      const url = window.location.href

      if (url === lastTrackedUrl) return

      metrika(counterId, 'hit', url, {
        title: document.title,
        referrer,
      })
      lastTrackedUrl = url
      referrer = url
    })
  }

  loadMetrikaTag(counterId)
  metrika(counterId, 'init', {
    ssr: true,
    defer: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    accurateTrackBounce: true,
    trackLinks: true,
  })

  nuxtApp.hook('app:mounted', trackPageView)
  router.afterEach((_to, _from, failure) => {
    if (!failure) trackPageView()
  })
})
