import { type GherkinDocument, type Pickle, TestStepResultStatus } from '@cucumber/messages'
import type { Lineage } from '@cucumber/query'
import { type Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import {
  createSearchIndex,
  deriveLineageConstraints,
  pruneGherkinDocuments,
  type SearchIndex,
} from '../search/index.js'
import { ensure } from './helpers.js'
import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'

export function useFilteredDocuments(): {
  results?: ReadonlyArray<GherkinDocument>
  filtered: boolean
} {
  const { cucumberQuery, gherkinQuery } = useQueries()
  const allTestCasesStarted = useMemo(() => cucumberQuery.findAllTestCaseStarted(), [cucumberQuery])
  const gherkinDocuments = useMemo(() => gherkinQuery.getGherkinDocuments(), [gherkinQuery])
  const { hideStatuses, tagExpression, searchTerm, unchanged } = useSearch()
  const lineageConstraints = useMemo(() => {
    const candidates: Array<{ pickle: Pickle; lineage: Lineage }> = []
    for (const testCaseStarted of allTestCasesStarted) {
      if (hideStatuses.length) {
        const status =
          cucumberQuery.findMostSevereTestStepResultBy(testCaseStarted)?.status ??
          TestStepResultStatus.UNKNOWN
        if (hideStatuses.includes(status)) {
          continue
        }
      }
      const pickle = ensure(
        cucumberQuery.findPickleBy(testCaseStarted),
        `No Pickle found for TestCaseStarted ${testCaseStarted.id}`
      )
      if (tagExpression) {
        const tags = pickle.tags.map((tag) => tag.name)
        if (!tagExpression.evaluate(tags)) {
          continue
        }
      }
      const lineage = ensure(
        cucumberQuery.findLineageBy(pickle),
        `No Lineage found for Pickle ${pickle.uri}`
      )
      candidates.push({ pickle, lineage })
    }
    return deriveLineageConstraints(candidates)
  }, [allTestCasesStarted, cucumberQuery, hideStatuses, tagExpression])
  const [searchIndex, setSearchIndex] = useState<SearchIndex | false>()
  const [results, setResults] = useState<ReadonlyArray<GherkinDocument>>()
  const setResultsSorting: Dispatch<ReadonlyArray<GherkinDocument>> = useCallback((unsorted) => {
    const sorted = [...unsorted]
    sorted.sort((a, b) => (a.uri || '').localeCompare(b.uri || ''))
    setResults(sorted)
  }, [])

  useEffect(() => {
    createSearchIndex(gherkinDocuments)
      .then((created) => setSearchIndex(created))
      .catch((error) => {
        console.error('Failed to create search index:', error)
        setSearchIndex(false)
      })
  }, [gherkinDocuments])
  useEffect(() => {
    if (searchTerm) {
      // we only deal with the non-search path in this effect
      return
    }
    setResultsSorting(pruneGherkinDocuments(gherkinDocuments, lineageConstraints))
  }, [gherkinDocuments, lineageConstraints, searchTerm, setResultsSorting])
  useEffect(() => {
    if (!searchTerm) {
      // we only deal with the search path in this effect
      return
    }
    if (searchIndex === undefined) {
      // search index is not ready yet
      return
    }
    if (searchIndex === false) {
      // search index failed to create - fallback
      setResultsSorting(pruneGherkinDocuments(gherkinDocuments, lineageConstraints))
      return
    }
    searchIndex
      .search(searchTerm)
      .then((searchHits) => {
        setResultsSorting(pruneGherkinDocuments(gherkinDocuments, lineageConstraints, searchHits))
      })
      .catch((error) => {
        console.error('Search failed:', error)
        setResultsSorting(pruneGherkinDocuments(gherkinDocuments, lineageConstraints))
      })
  }, [gherkinDocuments, lineageConstraints, searchIndex, searchTerm, setResultsSorting])

  return {
    results,
    filtered: !unchanged,
  }
}
