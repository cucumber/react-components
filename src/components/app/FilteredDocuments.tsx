import React, { FC } from 'react'

import { useFilteredDocuments } from '../../hooks/useFilteredDocuments.js'
import styles from './FilteredDocuments.module.scss'
import { GherkinDocumentList } from './GherkinDocumentList.js'

export const FilteredDocuments: FC = () => {
  const filtered = useFilteredDocuments()

  if (!filtered) {
    return null
  } else if (!filtered.length) {
    return <p className={styles.empty}>No scenarios were executed that match your query and/or filters.</p>
  }
  return <GherkinDocumentList gherkinDocuments={filtered} preExpand={true} />
}
