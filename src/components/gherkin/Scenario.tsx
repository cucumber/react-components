import type React from 'react'

import { useTestCaseStarted } from '../../hooks/useTestCaseStarted.js'
import { HighLight } from '../app/HighLight.js'
import {
  type DefaultComponent,
  type ScenarioProps,
  useCustomRendering,
} from '../customise/index.js'
import { TestCaseOutcome } from '../results/index.js'
import { Children } from './Children.js'
import { Description } from './Description.js'
import { Examples } from './Examples.js'
import { Keyword } from './Keyword.js'
import { Tags } from './Tags.js'
import { Title } from './Title.js'

const DefaultRenderer: DefaultComponent<ScenarioProps> = ({ scenario }) => {
  const examplesList = scenario.examples || []
  const testCaseStarted = useTestCaseStarted(scenario.id)

  return (
    <section>
      <Tags tags={scenario.tags} />
      <Title header="h2" id={scenario.id}>
        <Keyword>{scenario.keyword}:</Keyword>
        <HighLight text={scenario.name} />
      </Title>
      <Description description={scenario.description} />
      <Children>
        {testCaseStarted && <TestCaseOutcome testCaseStarted={testCaseStarted} />}
        {examplesList.length > 0 &&
          examplesList.map((examples, index) => <Examples key={index} examples={examples} />)}
      </Children>
    </section>
  )
}

export const Scenario: React.FunctionComponent<ScenarioProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<ScenarioProps>('Scenario', {}, DefaultRenderer)
  return <ResolvedRenderer {...props} />
}
