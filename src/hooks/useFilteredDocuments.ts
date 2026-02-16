import { GherkinDocumentWalker, rejectAllFilters } from '@cucumber/gherkin-utils'
import type { GherkinDocument, TestStepResultStatus } from '@cucumber/messages'
import type { Query } from '@cucumber/query'
import { useEffect, useState } from 'react'

import { createSearch, type Searchable } from '../search/index.js'
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
      const filtered = filterByStatus(searched, hideStatuses, cucumberQuery)
      const sorted = sortByUri(filtered)
      setResults(sorted)
    })
  }, [query, hideStatuses, cucumberQuery, searchable])
  return {
    results,
    filtered: !unchanged,
  }
}

function filterByStatus(
  searched: ReadonlyArray<GherkinDocument>,
  hideStatuses: ReadonlyArray<TestStepResultStatus>,
  query: Query
): ReadonlyArray<GherkinDocument> {
  const walker = new GherkinDocumentWalker({
    ...rejectAllFilters,
    acceptScenario: (scenario) => {
      return query
        .findAllTestCaseStarted()
        .filter((started) => query.findLineageBy(started)?.scenario?.id === scenario.id)
        .map((started) => query.findMostSevereTestStepResultBy(started)?.status)
        .some((status) => !hideStatuses.includes(status as TestStepResultStatus))
    },
  })

  return searched
    .map((original) => walker.walkGherkinDocument(original))
    .filter((gherkinDocument) => !!gherkinDocument) as ReadonlyArray<GherkinDocument>
}

function sortByUri(filtered: ReadonlyArray<GherkinDocument>) {
  const sorted = [...filtered]
  sorted.sort((a, b) => (a.uri || '').localeCompare(b.uri || ''))
  return sorted
}
