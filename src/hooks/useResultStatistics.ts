import countScenariosByStatuses from '../countScenariosByStatuses.js'
import { useQueries } from './useQueries.js'

export function useResultStatistics() {
  const { cucumberQuery } = useQueries()
  return countScenariosByStatuses(cucumberQuery)
}
