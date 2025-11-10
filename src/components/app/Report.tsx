import React, { FC } from 'react'

import { ExecutionSummary } from './ExecutionSummary.js'
import { FilteredDocuments } from './FilteredDocuments.js'
import styles from './Report.module.scss'
import { SearchBar } from './SearchBar.js'

export const Report: FC = () => {
  return (
    <article className={styles.layout}>
      <section>
        <ExecutionSummary/>
        <SearchBar/>
      </section>
      <section>
        <FilteredDocuments />
      </section>
    </article>
  )
}
