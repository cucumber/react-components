import type { TestCaseStarted } from '@cucumber/messages'
import { useMemo } from 'react'

import { useFilteredTestCasesStarted } from './useFilteredTestCasesStarted.js'
import { useQueries } from './useQueries.js'

/**
 * Finds the corresponding TestCaseStarted for an Example or Scenario node from a Gherkin
 * document, unless filtered out based on tag expression or status
 * @param nodeId the AST node id
 */
export function useTestCaseStarted(nodeId: string): TestCaseStarted | undefined {
  const { cucumberQuery } = useQueries()
  const filteredTestCases = useFilteredTestCasesStarted()
  const mapped = useMemo(() => {
    return filteredTestCases.reduce((prev, { testCaseStarted }) => {
      const lineage = cucumberQuery.findLineageBy(testCaseStarted)
      const closestNodeId = lineage?.example?.id ?? lineage?.scenario?.id
      if (closestNodeId) {
        prev.set(closestNodeId, testCaseStarted)
      }
      return prev
    }, new Map<string, TestCaseStarted>())
  }, [cucumberQuery, filteredTestCases])
  return mapped.get(nodeId)
}
