import React from 'react'

import { ChildrenClasses, ChildrenProps, DefaultComponent, useCustomRendering } from '../customise'
import defaultStyles from './Children.module.scss'

const DefaultRenderer: DefaultComponent<ChildrenProps, ChildrenClasses> = ({
  styles,
  children,
}) => {
  return <div className={styles.children}>{children}</div>
}

export const Children: React.FunctionComponent<ChildrenProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<ChildrenProps, ChildrenClasses>(
    'Children',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
