import React from 'react'

import { useSearch } from '../../hooks/index.js'
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
  const { query, hideStatuses } = useSearch()
  const filtered = useFilteredDocuments(query, hideStatuses)

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
            <GherkinDocumentList gherkinDocuments={filtered} preExpand={true} />
          ) : (
            <NoMatchResult query={query} />
          )}
        </>
      )}
    </div>
  )
}
