import React, { FC, PropsWithChildren } from 'react'

import styles from './Header.module.scss'

export const HeaderSection: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.section}>{children}</div>
}

export const HeaderItem: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.item}>{children}</div>
}

export const HeaderSubItem: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.subItem}>{children}</div>
}
