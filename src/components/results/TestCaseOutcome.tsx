import { TestCaseStarted } from '@cucumber/messages'
import React, { FC } from 'react'

import { useQueries } from '../../hooks/index.js'
import styles from './TestCaseOutcome.module.scss'
import { TestStepOutcome } from './TestStepOutcome.js'

interface Props {
  testCaseStarted: TestCaseStarted
}

export const TestCaseOutcome: FC<Props> = ({ testCaseStarted }) => {
  const { cucumberQuery } = useQueries()
  const steps = cucumberQuery.findTestStepFinishedAndTestStepBy(testCaseStarted)
  return (
    <div className={styles.container}>
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
