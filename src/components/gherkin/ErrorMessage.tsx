import React, { FC } from 'react'

import {
  DefaultComponent,
  ErrorMessageClasses,
  ErrorMessageProps,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './ErrorMessage.module.scss'

const DefaultRenderer: DefaultComponent<ErrorMessageProps, ErrorMessageClasses> = ({
  message,
  children,
  styles,
}) => {
  return <pre className={styles.message}>{message ?? children}</pre>
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ children, ...props }) => {
  const ResolvedRenderer = useCustomRendering<ErrorMessageProps, ErrorMessageClasses>(
    'ErrorMessage',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props}>{children}</ResolvedRenderer>
}
