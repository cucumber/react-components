import type { FC } from 'react'

import { CopyButton } from '../app/CopyButton.js'
import {
  type DefaultComponent,
  type ErrorMessageClasses,
  type ErrorMessageProps,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './ErrorMessage.module.scss'

const DefaultRenderer: DefaultComponent<ErrorMessageProps, ErrorMessageClasses> = ({
  message,
  children,
  styles,
}) => {
  const text = message ?? (typeof children === 'string' ? children : '')
  return (
    <div className={styles.message}>
      <pre>{message ?? children}</pre>
      <CopyButton className={styles.copyButton} text={text} />
    </div>
  )
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ children, ...props }) => {
  const ResolvedRenderer = useCustomRendering<ErrorMessageProps, ErrorMessageClasses>(
    'ErrorMessage',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props}>{children}</ResolvedRenderer>
}
