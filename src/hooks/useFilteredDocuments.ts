import { GherkinDocumentWalker, rejectAllFilters } from '@cucumber/gherkin-utils'
import type { GherkinDocument } from '@cucumber/messages'
import { useEffect, useState } from 'react'

import { createTextSearch, type Searchable } from '../search/index.js'
import { type FilterableTestCase, useFilteredTestCases } from './useFilteredTestCases.js'
import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'

export function useFilteredDocuments(): {
  results: GherkinDocument[] | undefined
  filtered: boolean
} {
  const { query, unchanged } = useSearch()
  const { gherkinQuery } = useQueries()
  const filteredTestCases = useFilteredTestCases()
  const [searchable, setSearchable] = useState<Searchable>()
  const [results, setResults] = useState<GherkinDocument[]>()
  useEffect(() => {
    createTextSearch(gherkinQuery).then((created) => setSearchable(created))
  }, [gherkinQuery])
  useEffect(() => {
    if (!searchable) {
      return
    }
    searchable.search(query).then((searched) => {
      const filtered = applyFilters(searched, filteredTestCases)
      const sorted = sortByUri(filtered)
      setResults(sorted)
    })
  }, [query, filteredTestCases, searchable])
  return {
    results,
    filtered: !unchanged,
  }
}

function applyFilters(
  searched: ReadonlyArray<GherkinDocument>,
  filteredTestCases: ReadonlyArray<FilterableTestCase>
): ReadonlyArray<GherkinDocument> {
  const scenarioIds = new Set(filteredTestCases.flatMap(({ pickle }) => pickle.astNodeIds))

  const walker = new GherkinDocumentWalker({
    ...rejectAllFilters,
    acceptScenario: (scenario) => scenarioIds.has(scenario.id),
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
