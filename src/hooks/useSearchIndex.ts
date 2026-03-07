import { useEffect, useState } from 'react'

import { createSearchIndex, type SearchIndex } from '../search/index.js'
import { useGherkinDocuments } from './useGherkinDocuments.js'

export function useSearchIndex(): SearchIndex | undefined {
  const gherkinDocuments = useGherkinDocuments()
  const [searchIndex, setSearchIndex] = useState<SearchIndex>()

  useEffect(() => {
    createSearchIndex(gherkinDocuments)
      .then((created) => setSearchIndex(created))
      .catch((error) => console.error('Failed to create search index:', error))
  }, [gherkinDocuments])

  return searchIndex
}
