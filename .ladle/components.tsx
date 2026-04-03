import type { GlobalProvider } from '@ladle/react'
import styles from './components.module.scss'

export const Provider: GlobalProvider = ({ children }) => (
  <div className={styles.wrapper}>{children}</div>
)
