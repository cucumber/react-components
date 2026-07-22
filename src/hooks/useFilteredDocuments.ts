import type { GherkinDocument } from '@cucumber/messages'
import { type Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import {
  deriveLineageConstraints,
  filterAndExpandTestCases,
  pruneGherkinDocuments,
} from '../search/index.js'
import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'
import { useSearchResult } from './useSearchResult.js'

export function useFilteredDocuments(): {
  results?: ReadonlyArray<GherkinDocument>
  filtered: boolean
} {
  const { cucumberQuery, gherkinQuery } = useQueries()
  const allTestCasesStarted = useMemo(() => cucumberQuery.findAllTestCaseStarted(), [cucumberQuery])
  const gherkinDocuments = useMemo(() => gherkinQuery.getGherkinDocuments(), [gherkinQuery])
  const { hideStatuses, tagExpression, unchanged } = useSearch()
  const lineageConstraints = useMemo(
    () =>
      deriveLineageConstraints(
        filterAndExpandTestCases(cucumberQuery, allTestCasesStarted, {
          hideStatuses,
          tagExpression,
        })
      ),
    [allTestCasesStarted, cucumberQuery, hideStatuses, tagExpression]
  )
  const searchResult = useSearchResult()
  const [results, setResults] = useState<ReadonlyArray<GherkinDocument>>()
  const setResultsSorting: Dispatch<ReadonlyArray<GherkinDocument>> = useCallback((unsorted) => {
    const sorted = [...unsorted]
    sorted.sort((a, b) => comparePaths(a.uri || '', b.uri || ''))
    setResults(sorted)
  }, [])

  useEffect(() => {
    switch (searchResult.status) {
      case 'WAITING':
        // results are not ready yet - leave them as they are
        return
      case 'NOOP':
      case 'ERROR':
        // no narrowing to apply
        setResultsSorting(pruneGherkinDocuments(gherkinDocuments, lineageConstraints))
        return
      case 'SUCCESS':
        setResultsSorting(
          pruneGherkinDocuments(gherkinDocuments, lineageConstraints, searchResult.hits)
        )
        return
    }
  }, [gherkinDocuments, lineageConstraints, searchResult, setResultsSorting])

  return {
    results,
    filtered: !unchanged,
  }
}

// Helper function for sorting directories
function comparePaths(uriA: string, uriB: string): number {
  // Assumes that last part of every uri is a file
  const partsA = uriA.split('/')
  const partsB = uriB.split('/')
  const minLength = Math.min(partsA.length, partsB.length)

  for (let i = 0; i < minLength; i++) {
    const partA = partsA[i]
    const partB = partsB[i]

    if (partA !== partB) {
      const isALast = i === partsA.length - 1
      const isBLast = i === partsB.length - 1

      if (isALast && !isBLast) {
        return 1 // A is file and B is directory -> B comes first
      }
      if (!isALast && isBLast) {
        return -1 // A is directory and B is file -> A comes first
      }

      // Both are files or both are directories -> Alphabetical sorting
      return partA.localeCompare(partB)
    }
  }

  // If one path is prefix of other then shorter path comes first
  return partsA.length - partsB.length
}
