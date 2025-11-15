import { TestCaseStarted, TestStepResultStatus } from '@cucumber/messages'
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
  const steps = cucumberQuery.findTestStepFinishedAndTestStepBy(testCaseStarted)
  const filtered = steps.filter(([testStepFinished, testStep]) => {
    if (showAllSteps) {
      return true
    }
    return (
      testStep.pickleStepId ||
      testStepFinished.testStepResult.status !== TestStepResultStatus.PASSED
    )
  })
  const hiddenSteps = steps.length - filtered.length
  return (
    <article className={styles.container}>
      <ol className={styles.steps}>
        {filtered.map(([testStepFinished, testStep]) => {
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
