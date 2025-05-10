export interface Product {
  id: number
  name: string
  slug: string
  full_name?: string
  price: number
  favorite: boolean
  product_line_id: number
  img_mini: string[]
  images?: { id: number; image_url: string }[]
  details?: Record<string, string>
  self: string
}

export interface PaginatedProducts {
  items: Product[]
  total: number
  page: number
  limit: number
  pages: number
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
export interface ProductListState {
  title: string
  titlePrefix?: string
  products: Product[]
  productsAreLoading: boolean
  hasMore: boolean
  firstLoading: boolean
}
