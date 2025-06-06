import type { Product } from '~/types/products.types'

export function normalizeProducts(products: Product[]): Product[] {
  return products.map((product) => {
    if (!product.img_mini || product.img_mini.length === 0) {
      product.img_mini = ['/img/no-image.png']
    }
    product.full_name = product.full_name?.trim()
    product.name = product.name?.trim()
    return product
  })
}
