import React from 'react'

import { DefaultComponent, KeywordClasses, useCustomRendering } from '../customise'
import defaultStyles from './Keyword.module.scss'

const DefaultRenderer: DefaultComponent<Record<string, never>, KeywordClasses> = ({
  children,
  styles,
}) => {
  return <span className={styles.keyword}>{children}</span>
}

export const Keyword: React.FunctionComponent = ({ children }) => {
  const ResolvedRenderer = useCustomRendering<unknown, KeywordClasses>(
    'Keyword',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer>{children}</ResolvedRenderer>
}
