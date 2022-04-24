import React from 'react'

import { DefaultComponent, GherkinStepsProps, useCustomRendering } from '../customise'
import { GherkinStep } from './GherkinStep'

const DefaultRenderer: DefaultComponent<GherkinStepsProps> = ({ steps, pickle, hasExamples }) => {
  return (
    <>
      {steps.map((step, index) => {
        const pickleStep = pickle?.steps.find((item) => item.astNodeIds.includes(step.id))
        return (
          <li key={index}>
            <GherkinStep
              key={index}
              step={step}
              pickleStep={pickleStep}
              hasExamples={hasExamples}
            />
          </li>
        )
      })}
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
