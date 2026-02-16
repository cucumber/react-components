import React, { type FunctionComponent, type ReactNode } from 'react'

import styles from './StepsList.module.scss'

export const StepsList: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return (
    <ol aria-label="Steps" className={styles.steps}>
      {children}
    </ol>
  )
}
