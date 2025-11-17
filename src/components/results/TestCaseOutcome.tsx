import {
  TestCaseStarted,
  TestStep,
  TestStepFinished,
  TestStepResultStatus,
} from '@cucumber/messages'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, useState } from 'react'

import { useQueries } from '../../hooks/index.js'
import styles from './TestCaseOutcome.module.scss'
import { TestStepOutcome } from './TestStepOutcome.js'

interface Props {
  testCaseStarted: TestCaseStarted
}

export const TestCaseOutcome: FC<Props> = ({ testCaseStarted }) => {
  const [showAllSteps, setShowAllSteps] = useState(false)
  const { cucumberQuery } = useQueries()
  const allSteps = cucumberQuery.findTestStepFinishedAndTestStepBy(testCaseStarted)
  const filteredSteps = showAllSteps ? allSteps : filterSteps(allSteps)
  const hiddenSteps = allSteps.length - filteredSteps.length
  return (
    <article className={styles.container}>
      <ol className={styles.steps}>
        {filteredSteps.map(([testStepFinished, testStep]) => {
          return (
            <TestStepOutcome
              key={testStep.id}
              testStep={testStep}
              testStepFinished={testStepFinished}
            />
          )
        })}
      </ol>
      {hiddenSteps > 0 && (
        <button className={styles.expandButton} onClick={() => setShowAllSteps(true)}>
          <FontAwesomeIcon aria-hidden="true" icon={faCirclePlus} />
          {hiddenSteps} hooks
        </button>
      )}
    </article>
  )
}

function filterSteps(allSteps: ReadonlyArray<[TestStepFinished, TestStep]>) {
  const statuses = allSteps.map(([testStepFinished]) => testStepFinished.testStepResult.status)
  return allSteps.filter(([testStepFinished, testStep], index) => {
    if (testStep.pickleStepId) {
      return true
    }
    if (testStepFinished.testStepResult.status === TestStepResultStatus.SKIPPED) {
      const previousStatus = statuses[index - 1] ?? TestStepResultStatus.PASSED
      return previousStatus === TestStepResultStatus.PASSED
    }
    return testStepFinished.testStepResult.status !== TestStepResultStatus.PASSED
  })
}
