import type React from 'react'

import {
  type DefaultComponent,
  type ParameterClasses,
  type ParameterProps,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './Parameter.module.scss'

const DefaultRenderer: DefaultComponent<ParameterProps, ParameterClasses> = ({
  parameterTypeName,
  value,
  children,
  styles,
}) => {
  return (
    <span title={parameterTypeName} aria-label={value} className={styles.parameter}>
      {children}
    </span>
  )
}

export const Parameter: React.FunctionComponent<ParameterProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<ParameterProps, ParameterClasses>(
    'Parameter',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
