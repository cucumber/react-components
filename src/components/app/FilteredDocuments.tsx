import React, { FC } from 'react'

import { useFilteredDocuments } from '../../hooks/useFilteredDocuments.js'
import { GherkinDocumentList } from './GherkinDocumentList.js'
import { NoMatchResult } from './NoMatchResult.js'

export const FilteredDocuments: FC = () => {
  const filtered = useFilteredDocuments()

  if (!filtered) {
    return null
  } else if (!filtered.length) {
    return <NoMatchResult />
  }
  return <GherkinDocumentList gherkinDocuments={filtered} preExpand={true} />
}
