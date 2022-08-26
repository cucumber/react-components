import React, { FunctionComponent, PropsWithChildren } from 'react'

import SearchQueryContext, { SearchQueryProps, useSearchQueryCtx } from '../../SearchQueryContext'

export const SearchWrapper: FunctionComponent<PropsWithChildren<SearchQueryProps>> = ({
  children,
  ...searchProps
}) => {
  return (
    <SearchQueryContext.Provider value={useSearchQueryCtx(searchProps)}>
      {children}
    </SearchQueryContext.Provider>
  )
}
