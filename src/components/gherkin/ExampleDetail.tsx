import { Pickle, Scenario } from '@cucumber/messages'
import React, { useContext, VoidFunctionComponent } from 'react'

import CucumberQueryContext from '../../CucumberQueryContext'
import { HighLight } from '../app/HighLight'
import { Description } from './Description'
import { ExamplesContext } from './ExamplesContext'
import { HookList } from './HookList'
import { Keyword } from './Keyword'
import { StepList } from './StepList'
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
        <ol>
          <HookList hookSteps={beforeHooks} />
          <StepList steps={scenario.steps || []} hasExamples={false} />
          <HookList hookSteps={afterHooks} />
        </ol>
      </section>
    </>
  )
}
