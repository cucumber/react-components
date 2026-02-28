import { GherkinDocumentWalker, rejectAllFilters } from '@cucumber/gherkin-utils'
import type { GherkinDocument } from '@cucumber/messages'
import { useEffect, useMemo, useState } from 'react'

import isTagExpression from '../isTagExpression.js'
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
  const gherkinDocuments = useMemo(() => {
    // this is a stable reference at time of writing, but that's a bug
    return gherkinQuery.getGherkinDocuments()
  }, [gherkinQuery])
  const filteredTestCases = useFilteredTestCases()
  const [searchable, setSearchable] = useState<Searchable>()
  const [results, setResults] = useState<GherkinDocument[]>()

  useEffect(() => {
    createTextSearch(gherkinDocuments).then((created) => setSearchable(created))
  }, [gherkinDocuments])
  useEffect(() => {
    if (!searchable) {
      return
    }
    if (query && !isTagExpression(query)) {
      searchable.search(query).then((searched) => {
        setResults(filterAndSort(searched, filteredTestCases))
      })
    } else {
      setResults(filterAndSort(gherkinDocuments, filteredTestCases))
    }
  }, [query, gherkinDocuments, filteredTestCases, searchable])
  return {
    results,
    filtered: !unchanged,
  }
}

function filterAndSort(
  searched: ReadonlyArray<GherkinDocument>,
  filteredTestCases: ReadonlyArray<FilterableTestCase>
) {
  return sortByUri(applyFilters(searched, filteredTestCases))
}

/**
 * Filters Gherkin documents to only include content that is present in executed test cases
 * after filters for tag expression and status have been applied.
 *
 * The GherkinDocumentWalker traverses each document and produces an abridged copy
 * containing only the scenarios whose IDs appear in our filtered set. Rules and
 * Features with no matching scenarios are excluded entirely.
 */
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
