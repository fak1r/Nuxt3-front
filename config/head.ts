const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default {
  title: 'Зам Пол — Ламинат, паркет, линолеум в наличии и под заказ',
  htmlAttrs: {
    lang: 'ru',
  },
  link: [
    {
      rel: 'shortcut icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
  meta: [
    {
      name: 'description',
      content:
        'Ламинат, паркет и линолеум в Коломне с быстрой доставкой. Подберём покрытие под ваш интерьер — в наличии и под заказ. Удобно, быстро, честно.',
    },
    {
      property: 'og:title',
      content: 'Зам Пол — магазин ламината, паркета и линолеума',
    },
    {
      property: 'og:description',
      content:
        'Широкий выбор напольных покрытий в Коломне. Доставка по городу и области. Поможем выбрать — без суеты и переплат.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: siteUrl,
    },
    {
      property: 'og:image',
      content: `${siteUrl}/static/og-image.jpg`,
    },
  ],
}
