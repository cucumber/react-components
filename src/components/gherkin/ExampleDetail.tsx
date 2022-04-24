import { Pickle, Scenario } from '@cucumber/messages'
import React, { useContext, VoidFunctionComponent } from 'react'

import CucumberQueryContext from '../../CucumberQueryContext'
import { HighLight } from '../app/HighLight'
import { Description } from './Description'
import { ExamplesContext } from './ExamplesContext'
import { GherkinSteps } from './GherkinSteps'
import { HookSteps } from './HookSteps'
import { Keyword } from './Keyword'
import { StepsList } from './StepsList'
import { Title } from './Title'

export const ExampleDetail: VoidFunctionComponent<{
  scenario: Scenario
  pickle: Pickle
}> = ({ scenario, pickle }) => {
  const { setSelectedExample } = useContext(ExamplesContext)
  const cucumberQuery = useContext(CucumberQueryContext)
  const beforeHooks = cucumberQuery.getBeforeHookSteps(pickle.id)
  const afterHooks = cucumberQuery.getAfterHookSteps(pickle.id)
  return (
    <>
      <button onClick={() => setSelectedExample()}>Back</button>
      <section>
        <Title header="h2" id={scenario.id}>
          <Keyword>Example:</Keyword>
          <HighLight text={pickle.name} />
        </Title>
        <Description description={scenario.description} />
        <StepsList>
          <HookSteps hookSteps={beforeHooks} />
          <GherkinSteps steps={scenario.steps || []} hasExamples={false} />
          <HookSteps hookSteps={afterHooks} />
        </StepsList>
      </section>
    </>
  )
}
