import * as messages from '@cucumber/messages'
import React, { FunctionComponent, PropsWithChildren } from 'react'

import { StatusIcon } from './StatusIcon'
import styles from './StepItem.module.scss'

export const StepItem: FunctionComponent<
  PropsWithChildren<{
    status?: messages.TestStepResultStatus
  }>
> = ({ status, children }) => {
  return (
    <div className={styles.container}>
      <span className={styles.status}>{status && <StatusIcon status={status} />}</span>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
