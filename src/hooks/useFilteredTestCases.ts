import type { TestCaseFinished } from '@cucumber/messages'
import { useEffect, useMemo, useState } from 'react'
import {
  type ExpandedTestCase,
  filterAndExpandTestCaseEvents,
  pruneTestCaseEvents,
} from '../search/index.js'
import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'
import { useSearchResult } from './useSearchResult.js'

export function useFilteredTestCases(): ReadonlyArray<ExpandedTestCase<TestCaseFinished>> {
  const { cucumberQuery } = useQueries()
  const allTestCasesFinished = useMemo(
    () => cucumberQuery.findAllTestCaseFinished(),
    [cucumberQuery]
  )
  const { hideStatuses, tagExpression } = useSearch()
  const candidates = useMemo(
    () =>
      filterAndExpandTestCaseEvents(cucumberQuery, allTestCasesFinished, {
        hideStatuses,
        tagExpression,
      }),
    [allTestCasesFinished, cucumberQuery, hideStatuses, tagExpression]
  )
  const searchResult = useSearchResult()
  const [results, setResults] = useState<ReadonlyArray<ExpandedTestCase<TestCaseFinished>>>([])

  useEffect(() => {
    switch (searchResult.status) {
      case 'WAITING':
        // results are not ready yet - leave them as they are
        return
      case 'NOOP':
      case 'ERROR':
        // no narrowing to apply
        setResults(candidates)
        return
      case 'SUCCESS':
        setResults(pruneTestCaseEvents(candidates, searchResult.hits))
        return
    }
  }, [candidates, searchResult])

  return results
}
