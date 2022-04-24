import React from 'react'

import { BackgroundProps, DefaultComponent, useCustomRendering } from '../customise'
import { Description } from './Description'
import { GherkinSteps } from './GherkinSteps'
import { Keyword } from './Keyword'
import { StepsList } from './StepsList'
import { Title } from './Title'

const DefaultRenderer: DefaultComponent<BackgroundProps> = ({ background }) => {
  return (
    <section>
      <Title header="h2" id={background.id}>
        <Keyword>{background.keyword}:</Keyword>
        <span>{background.name}</span>
      </Title>
      <Description description={background.description} />
      <StepsList>
        <GherkinSteps steps={background.steps || []} hasExamples={false} />
      </StepsList>
    </section>
  )
}

export const Background: React.FunctionComponent<BackgroundProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<BackgroundProps>('Background', {}, DefaultRenderer)
  return <ResolvedRenderer {...props} />
}
