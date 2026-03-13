import type { TestCaseStarted } from '@cucumber/messages'
import { useMemo } from 'react'

import { useQueries } from './useQueries.js'

/**
 * Finds the corresponding TestCaseStarted for an Example or Scenario node from a Gherkin
 * document
 * @param nodeId the Gherkin node id
 */
export function useTestCaseStarted(nodeId: string): TestCaseStarted | undefined {
  const { cucumberQuery } = useQueries()
  return useMemo(() => {
    for (const testCaseStarted of cucumberQuery.findAllTestCaseStarted()) {
      const pickle = cucumberQuery.findPickleBy(testCaseStarted)
      const closestNodeId = pickle?.astNodeIds.at(-1)
      if (closestNodeId === nodeId) {
        return testCaseStarted
      }
    }
  }, [cucumberQuery, nodeId])
}
