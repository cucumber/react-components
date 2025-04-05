import { formatDuration, intervalToDuration } from 'date-fns'

export function formatExecutionDuration(startDate: Date, finishDate: Date) {
  const inMilllis = finishDate.getTime() - startDate.getTime()
  // if under 10s, use 0.01s precision, otherwise 1s is fine
  if (inMilllis < 10000) {
    return `${new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
    }).format(inMilllis / 1000)} seconds`
  }
  return formatDuration(intervalToDuration({ start: startDate, end: finishDate }), {})
}
