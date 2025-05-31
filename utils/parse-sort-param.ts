export function parseSortParam(param?: string): { sort_by: string; order: 'asc' | 'desc' } | null {
  if (!param) return null
  const [sort_by, order] = param.split('_')
  if ((sort_by === 'price' || sort_by === 'name') && (order === 'asc' || order === 'desc')) {
    return { sort_by, order }
  }
  return null
}
