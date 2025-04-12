export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  img_mini: string[]
}

export interface ProductFilters {
  category_id?: number
  producer_id?: number
  favorite?: boolean
  page?: number
  per_page?: number
  sort_by?: string
  order?: string
}
