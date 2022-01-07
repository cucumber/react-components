import React from 'react'

import {
  BackgroundClasses,
  BackgroundProps,
  DefaultComponent,
  useCustomRendering,
} from '../customise'
import defaultStyles from './Background.module.scss'
import { Description } from './Description'
import { Keyword } from './Keyword'
import { StepList } from './StepList'
import { Title } from './Title'

const DefaultRenderer: DefaultComponent<BackgroundProps, BackgroundClasses> = ({
  background,
  styles,
}) => {
  return (
    <section>
      <Title header="h2" id={background.id}>
        <Keyword>{background.keyword}:</Keyword>
        <span>{background.name}</span>
      </Title>
      <Description description={background.description} />
      <ol className={styles.steps}>
        <StepList steps={background.steps || []} hasExamples={false} />
      </ol>
    </section>
  )
}

export const Background: React.FunctionComponent<BackgroundProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<BackgroundProps, BackgroundClasses>(
    'Background',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
