import { type Pickle, type TestCaseStarted, TestStepResultStatus } from '@cucumber/messages'
import { parse } from '@cucumber/tag-expressions'
import { useMemo } from 'react'

import isTagExpression from '../isTagExpression.js'
import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'

export interface FilterableTestCase {
  testCaseStarted: TestCaseStarted
  pickle: Pickle
}

export function useFilteredTestCases(): ReadonlyArray<FilterableTestCase> {
  const { query, hideStatuses } = useSearch()
  const { cucumberQuery } = useQueries()

  return useMemo(() => {
    const tagExpression = isTagExpression(query) ? parse(query) : undefined

    return cucumberQuery
      .findAllTestCaseStarted()
      .map((testCaseStarted) => {
        const pickle = cucumberQuery.findPickleBy(testCaseStarted) as Pickle
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
  }, [cucumberQuery, hideStatuses, query])
}
