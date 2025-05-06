import { useContext } from 'react'

import SearchQueryContext, { SearchContextValue } from '../SearchContext.js'

export function useSearch(): SearchContextValue {
  return useContext(SearchQueryContext)
}
