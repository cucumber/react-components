import { Pickle } from '@cucumber/messages'
import React, { useState } from 'react'

import CucumberQueryContext from '../../CucumberQueryContext'
import GherkinQueryContext from '../../GherkinQueryContext'
import UriContext from '../../UriContext'
import { HighLight } from '../app/HighLight'
import { DefaultComponent, ScenarioClasses, ScenarioProps, useCustomRendering } from '../customise'
import { Description } from './Description'
import { ExampleDetail } from './ExampleDetail'
import { Examples } from './Examples'
import { ExamplesContext } from './ExamplesContext'
import { HookList } from './HookList'
import { Keyword } from './Keyword'
import defaultStyles from './Scenario.module.scss'
import { StepList } from './StepList'
import { Tags } from './Tags'
import { Title } from './Title'

const DefaultRenderer: DefaultComponent<ScenarioProps, ScenarioClasses> = ({
  scenario,
  styles,
}) => {
  const examplesList = scenario.examples || []
  const hasExamples = examplesList.length > 0
  const cucumberQuery = React.useContext(CucumberQueryContext)
  const gherkinQuery = React.useContext(GherkinQueryContext)
  const uri = React.useContext(UriContext)
  const [selectedExample, setSelectedExample] = useState<Pickle>()
  const pickleIds = uri ? gherkinQuery.getPickleIds(uri, scenario.id) : []
  const beforeHooks = cucumberQuery.getBeforeHookSteps(pickleIds[0])
  const afterHooks = cucumberQuery.getAfterHookSteps(pickleIds[0])

  return (
    <ExamplesContext.Provider value={{ setSelectedExample }}>
      {selectedExample ? (
        <ExampleDetail scenario={scenario} pickle={selectedExample} />
      ) : (
        <section>
          <Tags tags={scenario.tags} />
          <Title header="h2" id={scenario.id}>
            <Keyword>{scenario.keyword}:</Keyword>
            <HighLight text={scenario.name} />
          </Title>
          <Description description={scenario.description} />
          <ol className={styles.steps}>
            <HookList hookSteps={beforeHooks} />
            <StepList steps={scenario.steps || []} hasExamples={hasExamples} />
            <HookList hookSteps={afterHooks} />
          </ol>
          {examplesList.map((examples, index) => (
            <Examples key={index} examples={examples} />
          ))}
        </section>
      )}
    </ExamplesContext.Provider>
  )
}

export const Scenario: React.FunctionComponent<ScenarioProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<ScenarioProps, ScenarioClasses>(
    'Scenario',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}
