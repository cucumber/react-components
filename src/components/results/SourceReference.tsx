import type { SourceReference as SourceReferenceMessage } from '@cucumber/messages'
import type { FC } from 'react'

import styles from './SourceReference.module.scss'

interface Props {
  sourceReference: SourceReferenceMessage
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
