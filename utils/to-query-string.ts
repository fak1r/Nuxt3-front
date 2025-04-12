export function toQueryString(filters: Record<string, any>): string {
  const queryObj = Object.fromEntries(
    Object.entries(filters)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  )

  return new URLSearchParams(queryObj).toString()
}
