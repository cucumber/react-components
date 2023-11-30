import { useContext } from 'react'

import SearchQueryContext, { SearchQueryCtx } from '../SearchQueryContext.js'

export function useSearch(): SearchQueryCtx {
  return useContext(SearchQueryContext)
}
