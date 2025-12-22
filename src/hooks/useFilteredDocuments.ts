import { GherkinDocument } from '@cucumber/messages'
import { useEffect, useState } from 'react'

import filterByStatus from '../filter/filterByStatus.js'
import { createSearch, Searchable } from '../search/index.js'
import statuses from '../statuses.js'
import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'

export function useFilteredDocuments(): {
  results: GherkinDocument[] | undefined
  filtered: boolean
} {
  const { query, hideStatuses, unchanged } = useSearch()
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
    searchable.search(query).then((searched) => {
      const filtered = searched
        .map((document) =>
          filterByStatus(
            document,
            gherkinQuery,
            cucumberQuery,
            statuses.filter((s) => !hideStatuses.includes(s))
          )
        )
        .filter((document) => document !== null) as GherkinDocument[]
      filtered.sort((a, b) => (a.uri || '').localeCompare(b.uri || ''))
      setResults(filtered)
    })
  }, [query, hideStatuses, gherkinQuery, cucumberQuery, searchable])
  return {
    results,
    filtered: !unchanged,
  }
}
