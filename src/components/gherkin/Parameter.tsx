import type { FC } from 'react'

import {
  type DefaultComponent,
  type ParameterClasses,
  type ParameterProps,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './Parameter.module.scss'

const DefaultRenderer: DefaultComponent<ParameterProps, ParameterClasses> = ({
  parameterTypeName,
  children,
  styles,
}) => {
  return (
    <span title={parameterTypeName} className={styles.parameter}>
      {children}
    </span>
  )
}

export const Parameter: FC<ParameterProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<ParameterProps, ParameterClasses>(
    'Parameter',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
