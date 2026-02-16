import type { FC, PropsWithChildren } from 'react'

import styles from './ResultNote.module.scss'

export const ResultNote: FC<PropsWithChildren> = ({ children }) => {
  return <p className={styles.note}>{children}</p>
}
