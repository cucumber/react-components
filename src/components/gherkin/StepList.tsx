import React from 'react'

import { DefaultComponent, StepListProps, useCustomRendering } from '../customise'
import { GherkinStep } from './GherkinStep'

const DefaultRenderer: DefaultComponent<StepListProps> = ({ steps, hasExamples }) => {
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

export const StepList: React.FunctionComponent<StepListProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<StepListProps>('StepList', {}, DefaultRenderer)
  return <ResolvedRenderer {...props} />
}
