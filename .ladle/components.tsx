import type { GlobalProvider } from '@ladle/react'
import React from 'react'
import styles from './components.module.scss'

export const Provider: GlobalProvider = ({ children, globalState, storyMeta }) => <div className={styles.wrapper}>{children}</div>
