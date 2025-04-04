import type { Product } from '~/types/products.types'

export function normalizeProducts(products: Product[]): Product[] {
  return products.map((product) => {
    if (!product.images || product.images.length === 0) {
      product.images = [{ id: -1, image_url: '/img/no-image.png' }]
    }
    return product
  })
}
