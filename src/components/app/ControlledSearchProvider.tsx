import React, { FC, PropsWithChildren, useMemo } from 'react'

import SearchQueryContext, { SearchContextValue, SearchState } from '../../SearchContext.js'

interface Props {
  value: SearchState
  onChange: (newValue: SearchState) => void
}

export const ControlledSearchProvider: FC<PropsWithChildren<Props>> = ({
  value,
  onChange,
  children,
}) => {
  const contextValue: SearchContextValue = useMemo(() => {
    return {
      query: value.query,
      hideStatuses: value.hideStatuses,
      update: (newValues: Partial<SearchState>) => {
        onChange({ ...value, ...newValues })
      },
    }
  }, [value, onChange])
  return <SearchQueryContext.Provider value={contextValue}>{children}</SearchQueryContext.Provider>
}
