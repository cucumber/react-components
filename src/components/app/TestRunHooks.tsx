import React, { type FC } from 'react'

import { useTestRunHooks } from '../../hooks/useTestRunHooks.js'
import { TestRunHookOutcome } from '../results/TestRunHookOutcome.js'
import styles from './TestRunHooks.module.scss'

export const TestRunHooks: FC = () => {
  const hooks = useTestRunHooks()

  if (hooks.length === 0) {
    return <p className={styles.empty}>No test run hooks were executed.</p>
  }

  return (
    <ol className={styles.hooks}>
      {hooks.map(({ testRunHookFinished, hook }) => {
        return (
          <TestRunHookOutcome key={hook.id} hook={hook} testRunHookFinished={testRunHookFinished} />
        )
      })}
    </ol>
  )
}
