type Category = { id: number }
type Producer = { id: number }
type Product = { id: number }

export default async function getSitemapRoutes(apiBaseUrl: string): Promise<{ url: string }[]> {
  const [categoriesRes, producersRes, productsRes] = await Promise.all([
    fetch(`${apiBaseUrl}/products/categories`),
    fetch(`${apiBaseUrl}/products/producers`),
    fetch(`${apiBaseUrl}/products`),
  ])

  if (!categoriesRes.ok) throw new Error(`Ошибка загрузки категорий: ${categoriesRes.status}`)
  if (!producersRes.ok) throw new Error(`Ошибка загрузки производителей: ${producersRes.status}`)
  if (!productsRes.ok) throw new Error(`Ошибка загрузки продуктов: ${productsRes.status}`)

  const categories: Category[] = await categoriesRes.json()
  const producers: Producer[] = await producersRes.json()
  const products: Product[] = await productsRes.json()

  const categoryRoutes = categories.map((c) => ({ url: `/catalog/${c.id}` }))
  const producerRoutes = producers.map((p) => ({ url: `/producers/${p.id}` }))
  const productRoutes = products.map((p) => ({ url: `/products/${p.id}` }))

  return [...categoryRoutes, ...producerRoutes, ...productRoutes]
}
