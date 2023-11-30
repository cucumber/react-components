import countScenariosByStatuses from '../countScenariosByStatuses.js'
import { useQueries } from './useQueries.js'

export function useResultStatistics() {
  const { gherkinQuery, cucumberQuery, envelopesQuery } = useQueries()
  return countScenariosByStatuses(gherkinQuery, cucumberQuery, envelopesQuery)
}
