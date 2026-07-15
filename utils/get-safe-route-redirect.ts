export function getSafeRouteRedirect(value: unknown, fallback = '/') {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/')) return fallback
  if (value.startsWith('//')) return fallback

  return value
}
