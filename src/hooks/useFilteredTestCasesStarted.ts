import { type Pickle, type TestCaseStarted, TestStepResultStatus } from '@cucumber/messages'
import { useMemo } from 'react'

import { ensure } from './helpers.js'
import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'

export interface FilterableTestCase {
  testCaseStarted: TestCaseStarted
  pickle: Pickle
}

/**
 * Pairs each TestCaseStarted with its originating Pickle, and filters based on tag expression
 * and status from the search state
 */
export function useFilteredTestCasesStarted(): ReadonlyArray<FilterableTestCase> {
  const { tagExpression, hideStatuses } = useSearch()
  const { cucumberQuery } = useQueries()

  return useMemo(() => {
    return cucumberQuery
      .findAllTestCaseStarted()
      .map((testCaseStarted) => {
        const pickle = ensure(
          cucumberQuery.findPickleBy(testCaseStarted),
          `No Pickle found for TestCaseStarted ${testCaseStarted.id}`
        )
        return { testCaseStarted, pickle }
      })
      .filter(({ testCaseStarted, pickle }) => {
        const status =
          cucumberQuery.findMostSevereTestStepResultBy(testCaseStarted)?.status ??
          TestStepResultStatus.UNKNOWN
        if (hideStatuses.includes(status)) {
          return false
        }
        if (tagExpression) {
          const tags = pickle.tags.map((tag) => tag.name)
          return tagExpression.evaluate(tags)
        }
        return true
      })
  }, [cucumberQuery, hideStatuses, tagExpression])
}
