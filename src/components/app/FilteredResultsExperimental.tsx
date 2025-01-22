import React, { FC } from 'react'

import { useQueries, useSearch } from '../../hooks/index.js'
import { useResultStatistics } from '../../hooks/useResultStatistics.js'
import { TestCaseOutcomes } from '../results/TestCaseOutcomes.js'
import { ExecutionSummary } from './ExecutionSummary.js'
import styles from './FilteredResults.module.scss'
import { NoMatchResult } from './NoMatchResult.js'
import { SearchBar } from './SearchBar.js'
import { StatusesSummary } from './StatusesSummary.js'

interface Props {
  className?: string
}

export const FilteredResultsExperimental: FC<Props> = ({ className }) => {
  const { cucumberQuery, envelopesQuery } = useQueries()
  const { scenarioCountByStatus, statusesWithScenarios, totalScenarioCount } = useResultStatistics()
  const { query, hideStatuses, update } = useSearch()
  const testCases = cucumberQuery.findAllTestCaseStarted()
  const filtered = testCases.filter((testCaseStarted) => {
    const mostSevereResult = cucumberQuery.findMostSevereTestStepResultBy(testCaseStarted)
    return !(mostSevereResult && hideStatuses.includes(mostSevereResult.status))
  })

  return (
    <div className={className}>
      <div className={styles.reportHeader}>
        <StatusesSummary
          scenarioCountByStatus={scenarioCountByStatus}
          totalScenarioCount={totalScenarioCount}
        />
        <ExecutionSummary
          scenarioCountByStatus={scenarioCountByStatus}
          totalScenarioCount={totalScenarioCount}
          testRunStarted={envelopesQuery.getTestRunStarted()}
          testRunFinished={envelopesQuery.getTestRunFinished()}
          meta={envelopesQuery.getMeta()}
        />
        <SearchBar
          query={query}
          onSearch={(newValue) => update({ query: newValue })}
          statusesWithScenarios={statusesWithScenarios}
          hideStatuses={hideStatuses}
          onFilter={(newValue) => update({ hideStatuses: newValue })}
        />
      </div>

      {filtered !== undefined && (
        <>
          {filtered.length > 0 ? (
            <TestCaseOutcomes testCases={filtered} />
          ) : (
            <NoMatchResult query={query} />
          )}
        </>
      )}
    </div>
  )
}
