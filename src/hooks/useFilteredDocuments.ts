import { GherkinDocumentWalker, rejectAllFilters } from '@cucumber/gherkin-utils'
import type { GherkinDocument } from '@cucumber/messages'
import { useEffect, useState } from 'react'

import {
  type FilterableTestCase,
  useFilteredTestCasesStarted,
} from './useFilteredTestCasesStarted.js'
import { useGherkinDocuments } from './useGherkinDocuments.js'
import { useSearch } from './useSearch.js'
import { useSearchIndex } from './useSearchIndex.js'

export function useFilteredDocuments(): {
  results: GherkinDocument[] | undefined
  filtered: boolean
} {
  const { searchTerm, unchanged } = useSearch()
  const gherkinDocuments = useGherkinDocuments()
  const searchIndex = useSearchIndex()
  const filteredTestCases = useFilteredTestCasesStarted()
  const [results, setResults] = useState<GherkinDocument[]>()
  useEffect(() => {
    if (!searchTerm) {
      setResults(filterAndSort(gherkinDocuments, filteredTestCases))
    }
  }, [searchTerm, gherkinDocuments, filteredTestCases])
  useEffect(() => {
    if (searchTerm && searchIndex) {
      const allowedUris = new Set(filteredTestCases.map(({ pickle }) => pickle.uri))
      searchIndex.search(searchTerm, allowedUris).then((searched) => {
        setResults(filterAndSort(searched, filteredTestCases))
      })
    }
  }, [searchTerm, searchIndex, filteredTestCases])
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
 * containing only the scenarios whose IDs appear in our filtered set. Rules, Features and
 * ultimately GherkinDocuments with no matching scenarios are excluded entirely.
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
