const fallbackSiteUrl = 'http://localhost:3000'

function normalizeBaseUrl(url: string): string {
  try {
    const parsed = new URL(url || fallbackSiteUrl)
    parsed.hostname = parsed.hostname.replace(/^www\./i, '')
    return parsed.toString().replace(/\/+$/, '')
  } catch {
    return fallbackSiteUrl
  }
}

function normalizePath(path: string): string {
  if (!path || path === '/') return '/'
  return path.replace(/\/+$/, '')
}

export default defineNuxtPlugin(() => {
  const route = useRoute()
  const config = useRuntimeConfig()

  const canonicalUrl = computed(() => {
    const base = normalizeBaseUrl(String(config.public.siteUrl || ''))
    const path = normalizePath(route.path)
    return `${base}${path}`
  })

  useHead({
    link: [
      {
        key: 'canonical',
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
    meta: [
      {
        key: 'og:url',
        property: 'og:url',
        content: canonicalUrl,
      },
    ],
  })
})
