import React, { FC } from 'react'

import { useTestRunHooks } from '../../hooks/useTestRunHooks.js'
import { TestRunHookOutcome } from '../results/TestRunHookOutcome.js'
import styles from './TestRunHooks.module.scss'

export const TestRunHooks: FC = () => {
  const hooks = useTestRunHooks()

  if (hooks.length === 0) {
    return <p className={styles.empty}>No hooks found.</p>
  }

  return (
    <ol aria-label="RunHooks" className={styles.hooks}>
      {hooks.map(({ testRunHookFinished, hook }) => {
        return (
          <TestRunHookOutcome
            key={hook.id}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            hook={hook!}
            testRunHookFinished={testRunHookFinished}
          />
        )
      })}
    </ol>
  )
}
