import React from 'react'

import CucumberQueryContext from '../../CucumberQueryContext.js'
import GherkinQueryContext from '../../GherkinQueryContext.js'
import UriContext from '../../UriContext.js'
import { HighLight } from '../app/HighLight.js'
import {
  DefaultComponent,
  ScenarioClasses,
  ScenarioProps,
  useCustomRendering,
} from '../customise/index.js'
import { Description } from './Description.js'
import { Examples } from './Examples.js'
import { HookList } from './HookList.js'
import { Keyword } from './Keyword.js'
import defaultStyles from './Scenario.module.scss'
import { StepList } from './StepList.js'
import { Tags } from './Tags.js'
import { Title } from './Title.js'

const DefaultRenderer: DefaultComponent<ScenarioProps, ScenarioClasses> = ({
  scenario,
  styles,
}) => {
  const examplesList = scenario.examples || []
  const hasExamples = examplesList.length > 0
  const cucumberQuery = React.useContext(CucumberQueryContext)
  const gherkinQuery = React.useContext(GherkinQueryContext)
  const uri = React.useContext(UriContext)
  const pickleIds = uri ? gherkinQuery.getPickleIds(uri, scenario.id) : []
  const beforeHooks = cucumberQuery.getBeforeHookSteps(pickleIds[0])
  const afterHooks = cucumberQuery.getAfterHookSteps(pickleIds[0])

  return (
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

      {examplesList.map((examples, index) => {
        return <Examples key={index} examples={examples} />
      })}
    </section>
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
