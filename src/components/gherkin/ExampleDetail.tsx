import { Pickle, Scenario } from '@cucumber/messages'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, VoidFunctionComponent } from 'react'

import CucumberQueryContext from '../../CucumberQueryContext'
import GherkinQueryContext from '../../GherkinQueryContext'
import { HighLight } from '../app/HighLight'
import { NavigationButton } from '../app/NavigationButton'
import { Description } from './Description'
import styles from './ExampleDetail.module.scss'
import { GherkinSteps } from './GherkinSteps'
import { HookSteps } from './HookSteps'
import { Keyword } from './Keyword'
import { StepsList } from './StepsList'
import { Tags } from './Tags'
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
  const examplesCount = scenario.examples.flatMap((examples) => examples.tableBody).length
  return (
    <>
      <NavigationButton onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} />
        Back to outline and all {examplesCount} examples
      </NavigationButton>
      <section>
        <Tags tags={pickle.tags} />
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
