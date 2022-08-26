import React, { FunctionComponent, PropsWithChildren } from 'react'

import styles from './StepsList.module.scss'

export const StepsList: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <ol aria-label="Steps" className={styles.steps}>
      {children}
    </ol>
  )
}
