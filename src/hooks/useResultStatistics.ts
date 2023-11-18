import countScenariosByStatuses from '../countScenariosByStatuses'
import { useQueries } from './useQueries'

export function useResultStatistics() {
  const { gherkinQuery, cucumberQuery, envelopesQuery } = useQueries()
  return countScenariosByStatuses(gherkinQuery, cucumberQuery, envelopesQuery)
}
