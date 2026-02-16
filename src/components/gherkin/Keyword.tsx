import type { FunctionComponent } from 'react'

import {
  type DefaultComponent,
  type KeywordClasses,
  type KeywordProps,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './Keyword.module.scss'

const DefaultRenderer: DefaultComponent<KeywordProps, KeywordClasses> = ({ children, styles }) => {
  return <span className={styles.keyword}>{children} </span>
}

export const Keyword: FunctionComponent<KeywordProps> = ({ children }) => {
  const ResolvedRenderer = useCustomRendering<KeywordProps, KeywordClasses>(
    'Keyword',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer>{children}</ResolvedRenderer>
}
