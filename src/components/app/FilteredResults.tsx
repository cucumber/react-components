import React, { FC } from 'react'

import { ExecutionSummary } from './ExecutionSummary.js'
import { FilteredDocuments } from './FilteredDocuments.js'
import styles from './FilteredResults.module.scss'
import { SearchBar } from './SearchBar.js'
import { StatusesSummary } from './StatusesSummary.js'

export const FilteredResults: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <div className={className}>
      <div className={styles.reportHeader}>
        <StatusesSummary />
        <ExecutionSummary />
        <SearchBar />
      </div>
      <FilteredDocuments />
    </div>
  )
}
