export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'http://localhost:3000'

  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8',
  })

  return [
    'User-agent: *',
    'Disallow: /api/',
    'Disallow: /admin/',
    'Disallow: /profile/',
    'Disallow: /cart/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n')
})
