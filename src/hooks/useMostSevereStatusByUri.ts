import { TestStepResultStatus } from '@cucumber/messages'
import { SetMultimap } from '@teppeis/multimaps'
import { useMemo } from 'react'

import { findMostSevereTestStepResultStatus } from '../components/app/findMostSevereTestStepResultStatus.js'
import { useQueries } from './useQueries.js'

export function useMostSevereStatusByUri(): Map<string, TestStepResultStatus> {
  const { cucumberQuery } = useQueries()
  return useMemo(() => {
    const allByUri = new SetMultimap<string, TestStepResultStatus>()
    for (const testCaseStarted of cucumberQuery.findAllTestCaseStarted()) {
      const result = cucumberQuery.findMostSevereTestStepResultBy(testCaseStarted)
      const status = result ? result.status : TestStepResultStatus.UNKNOWN
      const pickle = cucumberQuery.findPickleBy(testCaseStarted)
      if (pickle?.uri) {
        allByUri.put(pickle.uri, status)
      }
    }
    const mostSevereByUri = new Map<string, TestStepResultStatus>()
    for (const key of allByUri.keys()) {
      mostSevereByUri.set(key, findMostSevereTestStepResultStatus(allByUri.get(key)))
    }
    return mostSevereByUri
  }, [cucumberQuery])
}
