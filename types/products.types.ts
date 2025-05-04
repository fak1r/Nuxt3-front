export interface Product {
  id: number
  name: string
  slug: string
  price: number
  img_mini: string[]
  product_line_id: number
  self: string
}

export interface ProductFilters {
  category_slug?: string
  producer_slug?: string
  product_slug?: string
  favorite?: boolean
  page?: number
  limit?: number
  sort_by?: string
  order?: string
}

export interface Producer {
  id: number
  name: string
  slug: string
  category_id: number
}
