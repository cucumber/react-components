import { TestCaseStarted } from '@cucumber/messages'
import React from 'react'
import { FC } from 'react'

import { TestCaseOutcome } from './TestCaseOutcome.js'
import styles from './TestCaseOutcomes.module.scss'

interface Props {
  testCases: ReadonlyArray<TestCaseStarted>
}

export const TestCaseOutcomes: FC<Props> = ({ testCases }) => {
  return (
    <ol className={styles.testCases}>
      {testCases.map((testCaseStarted) => {
        return (
          <li key={testCaseStarted.id}>
            <TestCaseOutcome testCaseStarted={testCaseStarted} />
          </li>
        )
      })}
    </ol>
  )
}
