const INTERNAL_ORIGIN = 'https://zampol.local'

export function normalizeInternalPath(value: string) {
  try {
    const url = new URL(value, INTERNAL_ORIGIN)

    if (url.origin !== INTERNAL_ORIGIN) {
      return '/'
    }

    if (url.pathname !== '/') {
      url.pathname = url.pathname.replace(/\/+$/, '')
    }

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return '/'
  }
}

export function getSafeRouteRedirect(value: unknown, fallback = '/') {
  const normalizedFallback = normalizeInternalPath(fallback)

  if (typeof value !== 'string') return normalizedFallback
  if (!value.startsWith('/')) return normalizedFallback
  if (value.startsWith('//')) return normalizedFallback

  return normalizeInternalPath(value)
}
