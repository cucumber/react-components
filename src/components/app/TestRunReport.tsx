import React, { FC } from 'react'

import { useQueries, useSearch } from '../../hooks/index.js'
import { TestCaseOutcomes } from '../results/TestCaseOutcomes.js'
import { ExecutionSummary } from './ExecutionSummary.js'
import styles from './FilteredResults.module.scss'
import { NoMatchResult } from './NoMatchResult.js'
import { SearchBar } from './SearchBar.js'
import { StatusesSummary } from './StatusesSummary.js'

export const TestRunReport: FC<{
  className?: string
}> = ({ className }) => {
  const { cucumberQuery } = useQueries()
  const { hideStatuses } = useSearch()
  const testCases = cucumberQuery.findAllTestCaseStarted()
  const filtered = testCases.filter((testCaseStarted) => {
    const mostSevereResult = cucumberQuery.findMostSevereTestStepResultBy(testCaseStarted)
    return !(mostSevereResult && hideStatuses.includes(mostSevereResult.status))
  })

  return (
    <div className={className}>
      <div className={styles.reportHeader}>
        <StatusesSummary />
        <ExecutionSummary />
        <SearchBar />
      </div>

      {filtered !== undefined && (
        <>
          {filtered.length > 0 ? (
            <TestCaseOutcomes testCases={filtered} />
          ) : (
            <NoMatchResult />
          )}
        </>
      )}
    </div>
  )
}
