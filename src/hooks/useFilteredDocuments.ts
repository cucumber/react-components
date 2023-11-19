import { GherkinDocument, TestStepResultStatus } from '@cucumber/messages'

import { allStatuses } from '../countScenariosByStatuses'
import filterByStatus from '../filter/filterByStatus'
import { createSearch } from '../search'
import { useQueries } from './useQueries'

export function useFilteredDocuments(
  query: string,
  hideStatuses: readonly TestStepResultStatus[]
): GherkinDocument[] {
  const { gherkinQuery, cucumberQuery, envelopesQuery } = useQueries()
  const allDocuments = gherkinQuery.getGherkinDocuments()
  const search = createSearch(gherkinQuery)
  const matches = query ? search.search(query) : allDocuments
  return matches
    .map((document) =>
      filterByStatus(
        document,
        gherkinQuery,
        cucumberQuery,
        envelopesQuery,
        allStatuses.filter((s) => !hideStatuses.includes(s))
      )
    )
    .filter((document) => document !== null) as GherkinDocument[]
}
