import React from 'react'

import { useQueries, useSearch } from '../../hooks/index.js'
import { useFilteredDocuments } from '../../hooks/useFilteredDocuments.js'
import { useResultStatistics } from '../../hooks/useResultStatistics.js'
import { ExecutionSummary } from './ExecutionSummary.js'
import styles from './FilteredResults.module.scss'
import { GherkinDocumentList } from './GherkinDocumentList.js'
import { NoMatchResult } from './NoMatchResult.js'
import { SearchBar } from './SearchBar.js'
import { StatusesSummary } from './StatusesSummary.js'

interface IProps {
  className?: string
}

export const FilteredResults: React.FunctionComponent<IProps> = ({ className }) => {
  const { cucumberQuery } = useQueries()
  const { scenarioCountByStatus, statusesWithScenarios, totalScenarioCount } = useResultStatistics()
  const { query, hideStatuses, update } = useSearch()
  const filtered = useFilteredDocuments(query, hideStatuses)

  return (
    <div className={className}>
      <div className={styles.reportHeader}>
        <StatusesSummary />
        <ExecutionSummary
          scenarioCountByStatus={scenarioCountByStatus}
          totalScenarioCount={totalScenarioCount}
          testRunStarted={cucumberQuery.findTestRunStarted()}
          testRunFinished={cucumberQuery.findTestRunFinished()}
          meta={cucumberQuery.findMeta()}
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
            <GherkinDocumentList gherkinDocuments={filtered} preExpand={true} />
          ) : (
            <NoMatchResult query={query} />
          )}
        </>
      )}
    </div>
  )
}
