import { GherkinDocument } from '@cucumber/messages'
import { useEffect, useState } from 'react'

import { allStatuses } from '../countScenariosByStatuses.js'
import filterByStatus from '../filter/filterByStatus.js'
import { createSearch, Searchable } from '../search/index.js'
import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'

export function useFilteredDocuments(): GherkinDocument[] | undefined {
  const { query, hideStatuses } = useSearch()
  const { gherkinQuery, cucumberQuery } = useQueries()
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
              allStatuses.filter((s) => !hideStatuses.includes(s))
            )
          )
          .filter((document) => document !== null) as GherkinDocument[]
        setResults(filtered)
      }
    )
  }, [query, hideStatuses, gherkinQuery, cucumberQuery, searchable])
  return results
}
