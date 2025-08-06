import { GherkinDocument } from '@cucumber/messages'
import { useEffect, useState } from 'react'

import filterByStatus from '../filter/filterByStatus.js'
import { createSearch, Searchable } from '../search/index.js'
import statuses from '../statuses.js'
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
        const sortedByUri = [...searched].sort((a: GherkinDocument, b: GherkinDocument) => 
          (a.uri || '').localeCompare(b.uri || '')
        )
        const filtered = sortedByUri
          .map((document: GherkinDocument) =>
            filterByStatus(
              document,
              gherkinQuery,
              cucumberQuery,
              statuses.filter((s) => !hideStatuses.includes(s))
            )
          )
          .filter((document: GherkinDocument | null) => document !== null) as GherkinDocument[]
        setResults(filtered)
      }
    )
  }, [query, hideStatuses, gherkinQuery, cucumberQuery, searchable])
  return results
}
