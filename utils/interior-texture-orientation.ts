export type InteriorTextureAutoRotationInversion = boolean

const productAutoRotationInversions: Record<string, InteriorTextureAutoRotationInversion> = {
  // Add a producer/collection/product key here only after visual verification.
  // 'classen/visiogrande/chernyi-slanets': false,
}

const collectionAutoRotationInversions: Record<string, InteriorTextureAutoRotationInversion> = {
  // Use the inverse of the pixel-based auto rotation for this collection.
  'classen/visiogrande': true,
}

function getProductPathSegments(productPath?: string): string[] | undefined {
  if (!productPath) return undefined

  const segments = new URL(productPath, 'https://zampol.ru').pathname.split('/').filter(Boolean)
  return segments.length >= 4 ? segments : undefined
}

function getCollectionKey(productPath?: string): string | undefined {
  const segments = getProductPathSegments(productPath)
  if (!segments) return undefined

  return `${segments[1]}/${segments[2]}`
}

function getProductKey(productPath?: string): string | undefined {
  const segments = getProductPathSegments(productPath)
  if (!segments) return undefined

  return `${segments[1]}/${segments[2]}/${segments[3]}`
}

export function shouldInvertInteriorTextureAutoRotation(productPath?: string): boolean {
  const productKey = getProductKey(productPath)
  const collectionKey = getCollectionKey(productPath)
  return (productKey ? productAutoRotationInversions[productKey] : undefined) ?? (collectionKey ? collectionAutoRotationInversions[collectionKey] : undefined) ?? false
}
