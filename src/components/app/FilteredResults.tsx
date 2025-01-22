import React, { FC } from 'react'

import { useQueries, useSearch } from '../../hooks/index.js'
import { useFilteredDocuments } from '../../hooks/useFilteredDocuments.js'
import { useResultStatistics } from '../../hooks/useResultStatistics.js'
import { ExecutionSummary } from './ExecutionSummary.js'
import styles from './FilteredResults.module.scss'
import { FilteredResultsExperimental } from './FilteredResultsExperimental.js'
import { GherkinDocumentList } from './GherkinDocumentList.js'
import { NoMatchResult } from './NoMatchResult.js'
import { SearchBar } from './SearchBar.js'
import { StatusesSummary } from './StatusesSummary.js'

interface Props {
  className?: string
  experimental?: boolean
}

export const FilteredResults: FC<Props> = ({ className, experimental }) => {
  return experimental ? (
    <FilteredResultsExperimental className={className} />
  ) : (
    <FilteredResultsCurrent className={className} />
  )
}

const FilteredResultsCurrent: FC<Omit<Props, 'experimental'>> = ({ className }) => {
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
