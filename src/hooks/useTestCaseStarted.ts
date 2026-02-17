import type { TestCaseStarted } from '@cucumber/messages'
import { useMemo } from 'react'

import { useQueries } from './useQueries.js'

export function useTestCaseStarted(nodeId: string): TestCaseStarted | undefined {
  const { cucumberQuery } = useQueries()
  const mapped = useMemo(() => {
    return cucumberQuery.findAllTestCaseStarted().reduce((prev, testCaseStarted) => {
      const lineage = cucumberQuery.findLineageBy(testCaseStarted)
      const closestNodeId = lineage?.example?.id ?? lineage?.scenario?.id
      if (closestNodeId) {
        prev.set(closestNodeId, testCaseStarted)
      }
      return prev
    }, new Map<string, TestCaseStarted>())
  }, [cucumberQuery])
  return mapped.get(nodeId)
}
