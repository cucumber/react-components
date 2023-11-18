import { GherkinDocument, TestStepResultStatus } from '@cucumber/messages'

import { allStatuses } from '../countScenariosByStatuses'
import filterByStatus from '../filter/filterByStatus'
import Search from '../search/Search'
import { useQueries } from './useQueries'

export function useFilteredDocuments(
  query: string,
  hideStatuses: readonly TestStepResultStatus[]
): GherkinDocument[] {
  const { gherkinQuery, cucumberQuery, envelopesQuery } = useQueries()
  const allDocuments = gherkinQuery.getGherkinDocuments()
  const search = new Search(gherkinQuery)
  for (const gherkinDocument of allDocuments) {
    search.add(gherkinDocument)
  }
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
