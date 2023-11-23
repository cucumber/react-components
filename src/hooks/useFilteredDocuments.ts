import { GherkinDocument, TestStepResultStatus } from '@cucumber/messages'
import { useEffect, useState } from 'react'

import { allStatuses } from '../countScenariosByStatuses'
import filterByStatus from '../filter/filterByStatus'
import { createSearch, Searchable } from '../search'
import { useQueries } from './useQueries'

export function useFilteredDocuments(
  query: string,
  hideStatuses: readonly TestStepResultStatus[]
): GherkinDocument[] | undefined {
  const { gherkinQuery, cucumberQuery, envelopesQuery } = useQueries()
  const [searchable, setSearchable] = useState<Searchable>()
  const [results, setResults] = useState<GherkinDocument[]>()
  useEffect(() => {
    createSearch(gherkinQuery).then((created) => setSearchable(created))
  }, [gherkinQuery])
  useEffect(() => {
    if (!searchable) {
      return
    }
    ;(query ? searchable.search(query) : Promise.resolve(gherkinQuery.getGherkinDocuments())).then(
      (searched) => {
        const filtered = searched
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
        setResults(filtered)
      }
    )
  }, [query, hideStatuses, gherkinQuery, cucumberQuery, envelopesQuery, searchable])
  return results
}
