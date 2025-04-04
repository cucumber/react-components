export function formatPassRate(passed: number, total: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'percent',
  }).format(total > 0 ? passed / total : 0)
}
