import React from 'react'

import {
  DefaultComponent,
  TitleClasses,
  TitleProps,
  useCustomRendering,
} from '../customise/index.js'
import { Anchor } from './Anchor.js'
import defaultStyles from './Title.module.scss'

const DefaultRenderer: DefaultComponent<TitleProps, TitleClasses> = ({
  header: Header,
  id,
  children,
  styles,
}) => {
  return (
    <Anchor id={id}>
      <Header id={id} className={styles.title}>
        {children}
      </Header>
    </Anchor>
  )
}

export const Title: React.FunctionComponent<TitleProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<TitleProps, TitleClasses>(
    'Title',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
