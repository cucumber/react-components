import type { Hook, TestRunHookFinished } from '@cucumber/messages'

import { ensure } from './helpers.js'
import { useQueries } from './useQueries.js'

type RunHooksList = { testRunHookFinished: TestRunHookFinished; hook: Hook }[]

export function useTestRunHooks(): RunHooksList {
  const { cucumberQuery } = useQueries()
  const testRunHooksFinished: ReadonlyArray<TestRunHookFinished> =
    cucumberQuery.findAllTestRunHookFinished()

  return testRunHooksFinished.map((testRunHookFinished) => {
    const hook = ensure(
      cucumberQuery.findHookBy(testRunHookFinished),
      'Expected testRunHookFinished to resolve with a hook'
    )

    return {
      testRunHookFinished,
      hook,
    }
  })
}
