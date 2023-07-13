import React, { FC, HTMLAttributes } from 'react'

import styles from './NavigationButton.module.scss'

export const NavigationButton: FC<HTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button type="button" {...props} className={styles.navigationButton}>
      {children}
    </button>
  )
}
