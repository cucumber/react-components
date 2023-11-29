import React, { useState } from 'react'

import CucumberQueryContext from '../../CucumberQueryContext.js'
import GherkinQueryContext from '../../GherkinQueryContext.js'
import UriContext from '../../UriContext.js'
import { HighLight } from '../app/HighLight.js'
import { DefaultComponent, ScenarioProps, useCustomRendering } from '../customise/index.js'
import { Description } from './Description.js'
import { ExampleDetail } from './ExampleDetail.js'
import { Examples } from './Examples.js'
import { ExamplesContext } from './ExamplesContext.js'
import { GherkinSteps } from './GherkinSteps.js'
import { HookSteps } from './HookSteps.js'
import { Keyword } from './Keyword.js'
import { StepsList } from './StepsList.js'
import { Tags } from './Tags.js'
import { Title } from './Title.js'

const DefaultRenderer: DefaultComponent<ScenarioProps> = ({ scenario }) => {
  const examplesList = scenario.examples || []
  const hasExamples = examplesList.length > 0
  const cucumberQuery = React.useContext(CucumberQueryContext)
  const gherkinQuery = React.useContext(GherkinQueryContext)
  const uri = React.useContext(UriContext)
  const [selectedExample, setSelectedExample] = useState<string>()
  const pickleIds = uri ? gherkinQuery.getPickleIds(uri, scenario.id) : []
  const beforeHooks = cucumberQuery.getBeforeHookSteps(pickleIds[0])
  const afterHooks = cucumberQuery.getAfterHookSteps(pickleIds[0])

  if (selectedExample) {
    return (
      <ExampleDetail
        scenario={scenario}
        pickleId={selectedExample}
        onBack={() => setSelectedExample(undefined)}
      />
    )
  }
  return (
    <section>
      <Tags tags={scenario.tags} />
      <Title header="h2" id={scenario.id}>
        <Keyword>{scenario.keyword}:</Keyword>
        <HighLight text={scenario.name} />
      </Title>
      <Description description={scenario.description} />
      <StepsList>
        <HookSteps hookSteps={beforeHooks} />
        <GherkinSteps steps={scenario.steps || []} hasExamples={hasExamples} />
        <HookSteps hookSteps={afterHooks} />
      </StepsList>
      {hasExamples && (
        <ExamplesContext.Provider value={{ setSelectedExample }}>
          {examplesList.map((examples, index) => (
            <Examples key={index} examples={examples} />
          ))}
        </ExamplesContext.Provider>
      )}
    </section>
  )
}

export const Scenario: React.FunctionComponent<ScenarioProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<ScenarioProps>('Scenario', {}, DefaultRenderer)
  return <ResolvedRenderer {...props} />
}
