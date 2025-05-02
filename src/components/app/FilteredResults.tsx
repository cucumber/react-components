import React, { FC } from 'react'

import { ExecutionSummary } from './ExecutionSummary.js'
import { FilteredDocuments } from './FilteredDocuments.js'
import styles from './FilteredResults.module.scss'
import { SearchBar } from './SearchBar.js'

export const FilteredResults: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <div className={className}>
      <div className={styles.reportHeader}>
        <ExecutionSummary />
        <SearchBar />
      </div>
      <FilteredDocuments />
    </div>
  )
}
