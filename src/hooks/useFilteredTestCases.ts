import type { TestCaseStarted } from '@cucumber/messages'
import { useMemo } from 'react'

import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'

export function useFilteredTestCases(): ReadonlyArray<TestCaseStarted> {
  const { hideStatuses } = useSearch()
  const { cucumberQuery } = useQueries()

  return useMemo(() => {
    return cucumberQuery.findAllTestCaseStarted().filter((testCaseStarted) => {
      const status = cucumberQuery.findMostSevereTestStepResultBy(testCaseStarted)?.status
      return status && !hideStatuses.includes(status)
    })
  }, [cucumberQuery, hideStatuses])
}
