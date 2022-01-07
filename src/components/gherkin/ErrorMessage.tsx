import React from 'react'

import {
  DefaultComponent,
  ErrorMessageClasses,
  ErrorMessageProps,
  useCustomRendering,
} from '../customise'
import defaultStyles from './ErrorMessage.module.scss'

const DefaultRenderer: DefaultComponent<ErrorMessageProps, ErrorMessageClasses> = ({
  message,
  styles,
}) => {
  return <pre className={styles.message}>{message}</pre>
}

export const ErrorMessage: React.FunctionComponent<ErrorMessageProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<ErrorMessageProps, ErrorMessageClasses>(
    'ErrorMessage',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
