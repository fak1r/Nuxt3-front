export type InteriorTextureOrientation = 'auto' | 'natural' | 'rotated'

const productOrientationOverrides: Record<number, InteriorTextureOrientation> = {
  // Add a product id here only after visual verification.
}

const productLineOrientationOverrides: Record<number, InteriorTextureOrientation> = {
  // Classen VisioGrande panels are shown with their long side across the room.
  7: 'natural',
}

export function getInteriorTextureOrientation(productId: number, productLineId?: number): InteriorTextureOrientation {
  return productOrientationOverrides[productId] ?? (productLineId ? productLineOrientationOverrides[productLineId] : undefined) ?? 'auto'
}
