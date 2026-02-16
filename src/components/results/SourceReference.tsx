import type { SourceReference as MessagesSourceReference } from '@cucumber/messages'
import React from 'react'
import type { FC } from 'react'

import styles from './SourceReference.module.scss'

interface Props {
  sourceReference: MessagesSourceReference
}

export const SourceReference: FC<Props> = ({ sourceReference }) => {
  if (sourceReference.uri) {
    let stringified = sourceReference.uri
    if (sourceReference.location) {
      stringified += `:${sourceReference.location.line}`
    }
    return <code className={styles.sourceReference}>{stringified}</code>
  }
  return null
}
