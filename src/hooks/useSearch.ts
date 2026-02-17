import { useContext } from 'react'

import SearchQueryContext, { type SearchContextValue } from '../SearchContext.js'

export function useSearch(): SearchContextValue {
  return useContext(SearchQueryContext)
}
