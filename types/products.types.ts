export type Product = {
  id: number
  name: string
  description: string
  price: number
  stock: number
  images: {
    id?: number
    image_url?: string
  }[]
}
