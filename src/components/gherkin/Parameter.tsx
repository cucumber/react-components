import type { FC } from 'react'

import {
  type DefaultComponent,
  type ParameterClasses,
  type ParameterProps,
  useCustomRendering,
} from '../customise/index.js'
import defaultStyles from './Parameter.module.scss'

const DefaultRenderer: DefaultComponent<ParameterProps, ParameterClasses> = ({
  children,
  styles,
}) => {
  return <span className={styles.parameter}>{children}</span>
}

export const Parameter: FC<ParameterProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<ParameterProps, ParameterClasses>(
    'Parameter',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
