import { formatDistanceStrict } from 'date-fns'

export function formatExecutionDistance(date: Date, referenceDate: Date = new Date()) {
  return formatDistanceStrict(date, referenceDate, {
    addSuffix: true,
  })
}
