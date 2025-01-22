import { Pickle, TestCaseStarted } from '@cucumber/messages'
import { namingStrategy, NamingStrategyLength } from '@cucumber/query'
import React, { FC } from 'react'

import { useQueries } from '../../hooks/index.js'
import { Tags } from '../gherkin/index.js'
import styles from './TestCaseOutcome.module.scss'
import { TestStepOutcome } from './TestStepOutcome.js'

interface Props {
  testCaseStarted: TestCaseStarted
}

export const TestCaseOutcome: FC<Props> = ({ testCaseStarted }) => {
  const { cucumberQuery } = useQueries()
  const steps = cucumberQuery.findTestStepFinishedAndTestStepBy(testCaseStarted)
  const pickle = cucumberQuery.findPickleBy(testCaseStarted) as Pickle
  const name = cucumberQuery.findNameOf(pickle, namingStrategy(NamingStrategyLength.LONG))
  return (
    <div className={styles.container}>
      <Tags tags={pickle.tags} />
      <h2 className={styles.title}>{name}</h2>
      <ol className={styles.steps}>
        {steps.map(([testStepFinished, testStep]) => {
          return (
            <li key={testStep.id}>
              <TestStepOutcome testStep={testStep} testStepFinished={testStepFinished} />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
