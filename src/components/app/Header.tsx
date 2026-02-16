import type { FC, PropsWithChildren } from 'react'

import styles from './Header.module.scss'

export const HeaderSection: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.section}>{children}</div>
}

export const HeaderItem: FC<PropsWithChildren<{ testId?: string }>> = ({ testId, children }) => {
  return (
    <div data-testid={testId} className={styles.item}>
      {children}
    </div>
  )
}

export const HeaderSubItem: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.subItem}>{children}</div>
}
