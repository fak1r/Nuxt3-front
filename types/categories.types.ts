export interface Category {
  id: number
  name: string
  slug: string
}

export interface Producer {
  id: number
  name: string
  slug: string
  category_id: number
}

export interface ProductLine {
  id: number
  name: string
  slug: string
  producer_id: number
}

export interface ProductLineCatalogItem {
  id: number
  name: string
  slug: string
  product_count: number
  cover_image_url?: string | null
}

export interface ProducerCatalogItem extends Producer {
  country?: string | null
  description?: string | null
  logo_url?: string | null
  product_count: number
  product_lines: ProductLineCatalogItem[]
}
