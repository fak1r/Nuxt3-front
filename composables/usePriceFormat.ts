export function usePriceFormat() {
  const formatPrice = function (value: number): string {
    if (isNaN(value)) return ''
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  return {
    formatPrice,
  }
}
