import type { GherkinDocument } from '@cucumber/messages'
import { useMemo } from 'react'

import { useQueries } from './useQueries.js'

export function useGherkinDocuments(): ReadonlyArray<GherkinDocument> {
  const { gherkinQuery } = useQueries()
  return useMemo(() => {
    // this is a stable reference at time of writing, but that's a bug
    return gherkinQuery.getGherkinDocuments()
  }, [gherkinQuery])
}
