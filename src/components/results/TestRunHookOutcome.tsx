import { Hook, HookType, TestRunHookFinished } from '@cucumber/messages'
import React, { FC } from 'react'

import { StatusIcon } from '../gherkin/index.js'
import styles from './TestRunHookOutcome.module.scss'
import { TestStepAttachments } from './TestStepAttachments.js'
import { TestStepDuration } from './TestStepDuration.js'
import { TestStepResultDetails } from './TestStepResultDetails.js'

interface Props {
  hook: Hook
  testRunHookFinished: TestRunHookFinished
}

export const TestRunHookOutcome: FC<Props> = ({ hook, testRunHookFinished }) => {
  return (
    <li data-status={testRunHookFinished.result.status}>
      <div className={styles.header}>
        <div className={styles.status}>
          <StatusIcon status={testRunHookFinished.result.status} />
        </div>
        <div className={styles.title}>
          <h3 className={styles.name}>
            {hook.name ?? (hook.type === HookType.BEFORE_TEST_RUN ? 'BeforeAll' : 'AfterAll')}
          </h3>
          <TestStepDuration duration={testRunHookFinished.result.duration} />
        </div>
      </div>
      <div className={styles.content}>
        <TestStepResultDetails {...testRunHookFinished.result} />
        <TestStepAttachments testStepOrHookFinished={testRunHookFinished} />
      </div>
    </li>
  )
}
