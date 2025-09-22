import React, { FunctionComponent, ReactNode } from 'react'

import styles from './TestRunHooksList.module.scss'

export const RunHooksList: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return (
    <ol aria-label="RunHooks" className={styles.hooks}>
      {children}
    </ol>
  )
}
