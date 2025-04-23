export function formatStatusRate(passed: number, total: number) {
  const percentPassed = total > 0 ? passed / total : 0
  const roundedDown = Math.floor(percentPassed * 100) / 100

  return new Intl.NumberFormat(undefined, {
    style: 'percent',
  }).format(roundedDown)
}
