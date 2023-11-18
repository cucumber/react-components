import React from 'react'

import { useQueries, useSearch } from '../../hooks'
import { useFilteredDocuments } from '../../hooks/useFilteredDocuments'
import { useResultStatistics } from '../../hooks/useResultStatistics'
import { ExecutionSummary } from './ExecutionSummary'
import styles from './FilteredResults.module.scss'
import { GherkinDocumentList } from './GherkinDocumentList'
import { NoMatchResult } from './NoMatchResult'
import { SearchBar } from './SearchBar'
import { StatusesSummary } from './StatusesSummary'

interface IProps {
  className?: string
}

export const FilteredResults: React.FunctionComponent<IProps> = ({ className }) => {
  const { envelopesQuery } = useQueries()
  const { scenarioCountByStatus, statusesWithScenarios, totalScenarioCount } = useResultStatistics()
  const { query, hideStatuses, update } = useSearch()
  const filtered = useFilteredDocuments(query, hideStatuses)

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

      {filtered.length > 0 && <GherkinDocumentList gherkinDocuments={filtered} preExpand={true} />}
      {filtered.length < 1 && <NoMatchResult query={query} />}
    </div>
  )
}
