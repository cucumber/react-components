import { TestRunHookFinished } from '@cucumber/messages'
import React, { FC } from 'react'

import { useQueries } from '../../hooks/useQueries.js'
import { RunHooksList } from '../gherkin/TestRunHooksList.js'
import { RunHookOutcome } from '../results/TestRunHookOutcome.js'

export const TestRunHooks: FC = () => {
  const { cucumberQuery } = useQueries()
  const testRunHooksFinished: ReadonlyArray<TestRunHookFinished> =
    cucumberQuery.findAllTestRunHookFinished()
  return (
    <RunHooksList>
      {testRunHooksFinished.map((testRunHookFinished) => {
        const testRunHook = cucumberQuery.findHookBy(testRunHookFinished)

        return (
          <RunHookOutcome
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            key={testRunHook!.id}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            hook={testRunHook!}
            testRunHookFinished={testRunHookFinished}
          />
        )
      })}
    </RunHooksList>
  )
}
