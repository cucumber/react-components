import React, { FunctionComponent } from 'react'

import styles from './StepsList.module.scss'

export const StepsList: FunctionComponent = ({ children }) => {
  return <ol className={styles.steps}>{children}</ol>
}
