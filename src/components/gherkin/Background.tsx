import React from 'react'

import { BackgroundProps, DefaultComponent, useCustomRendering } from '../customise/index.js'
import { Description } from './Description.js'
import { GherkinSteps } from './GherkinSteps.js'
import { Keyword } from './Keyword.js'
import { StepsList } from './StepsList.js'
import { Title } from './Title.js'

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
