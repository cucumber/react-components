import React, { FunctionComponent } from 'react'

import { DefaultComponent, KeywordClasses, KeywordProps, useCustomRendering } from '../customise'
import defaultStyles from './Keyword.module.scss'

const DefaultRenderer: DefaultComponent<Record<string, never>, KeywordClasses> = ({
  children,
  styles,
}) => {
  return <span className={styles.keyword}>{children}</span>
}

export const Keyword: FunctionComponent<KeywordProps> = ({ children }) => {
  const ResolvedRenderer = useCustomRendering<KeywordProps, KeywordClasses>(
    'Keyword',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer>{children}</ResolvedRenderer>
}
