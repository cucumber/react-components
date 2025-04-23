export function formatStatusRate(passed: number, total: number) {
  const percentPassed = total > 0 ? passed / total : 0
  const roundedDown = Math.floor(percentPassed * 1000) / 1000

  return new Intl.NumberFormat(undefined, {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(roundedDown)
}
