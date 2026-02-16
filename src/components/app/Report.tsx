import type { FC } from 'react'

import { ExecutionSummary } from './ExecutionSummary.js'
import { FilteredDocuments } from './FilteredDocuments.js'
import styles from './Report.module.scss'
import { SearchBar } from './SearchBar.js'
import { TestRunHooks } from './TestRunHooks.js'

export const Report: FC = () => {
  return (
    <article className={styles.layout}>
      <section>
        <ExecutionSummary />
        <SearchBar />
      </section>
      <section>
        <h2 className={styles.heading}>Scenarios</h2>
        <FilteredDocuments />
      </section>
      <section>
        <h2 className={styles.heading}>Hooks</h2>
        <TestRunHooks />
      </section>
    </article>
  )
}
