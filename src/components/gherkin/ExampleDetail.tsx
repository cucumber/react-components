import { Pickle, Scenario } from '@cucumber/messages'
import React, { useContext, VoidFunctionComponent } from 'react'

import CucumberQueryContext from '../../CucumberQueryContext'
import GherkinQueryContext from '../../GherkinQueryContext'
import { HighLight } from '../app/HighLight'
import { Description } from './Description'
import { GherkinSteps } from './GherkinSteps'
import { HookSteps } from './HookSteps'
import { Keyword } from './Keyword'
import { StepsList } from './StepsList'
import { Title } from './Title'

export const ExampleDetail: VoidFunctionComponent<{
  scenario: Scenario
  pickleId: string
  onBack: () => void
}> = ({ scenario, pickleId, onBack }) => {
  const gherkinQuery = useContext(GherkinQueryContext)
  const cucumberQuery = useContext(CucumberQueryContext)
  const pickle: Pickle = gherkinQuery.getPickles().find((item) => item.id === pickleId) as Pickle
  const beforeHooks = cucumberQuery.getBeforeHookSteps(pickleId)
  const afterHooks = cucumberQuery.getAfterHookSteps(pickleId)
  return (
    <>
      <button onClick={onBack}>Back</button>
      <section>
        <Title header="h2" id={scenario.id}>
          <Keyword>Example:</Keyword>
          <HighLight text={pickle.name} />
        </Title>
        <Description description={scenario.description} />
        <StepsList>
          <HookSteps hookSteps={beforeHooks} />
          <GherkinSteps steps={scenario.steps || []} pickle={pickle} hasExamples={false} />
          <HookSteps hookSteps={afterHooks} />
        </StepsList>
      </section>
    </>
  )
}
