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
