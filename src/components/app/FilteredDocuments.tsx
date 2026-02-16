import type { FC } from 'react'

import { useFilteredDocuments } from '../../hooks/useFilteredDocuments.js'
import styles from './FilteredDocuments.module.scss'
import { GherkinDocumentList } from './GherkinDocumentList.js'

export const FilteredDocuments: FC = () => {
  const { results, filtered } = useFilteredDocuments()

  if (!results) {
    return null
  }
  if (!results.length) {
    return filtered ? (
      <p className={styles.empty}>No scenarios match your query and/or filters.</p>
    ) : (
      <p className={styles.empty}>No scenarios were executed.</p>
    )
  }
  return <GherkinDocumentList gherkinDocuments={results} preExpand={true} />
}
