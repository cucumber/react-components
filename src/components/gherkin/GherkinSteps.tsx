import React from 'react'

import { DefaultComponent, GherkinStepsProps, useCustomRendering } from '../customise'
import { GherkinStep } from './GherkinStep'

const DefaultRenderer: DefaultComponent<GherkinStepsProps> = ({ steps, hasExamples }) => {
  return (
    <>
      {steps.map((step, index) => (
        <li key={index}>
          <GherkinStep key={index} step={step} hasExamples={hasExamples} />
        </li>
      ))}
    </>
  )
}

export const GherkinSteps: React.FunctionComponent<GherkinStepsProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<GherkinStepsProps>(
    'GherkinSteps',
    {},
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
