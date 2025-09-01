import { TestCaseStarted } from '@cucumber/messages'

import { useQueries } from './useQueries.js'

export function useTestCaseStarted(nodeId: string): TestCaseStarted | undefined {
  const { cucumberQuery } = useQueries()
  const all = cucumberQuery.findAllTestCaseStarted()
  const mapped = all.reduce((prev, testCaseStarted) => {
    const lineage = cucumberQuery.findLineageBy(testCaseStarted)
    const closestNodeId = lineage?.example?.id ?? lineage?.scenario?.id
    if (closestNodeId) {
      prev.set(closestNodeId, testCaseStarted)
    }
    return prev
  }, new Map<string, TestCaseStarted>())
  return mapped.get(nodeId)
}
