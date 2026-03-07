import { parse } from '@cucumber/tag-expressions'
import { type FC, type PropsWithChildren, useMemo } from 'react'

import isTagExpression from '../../isTagExpression.js'
import SearchQueryContext, {
  type SearchContextValue,
  type SearchState,
} from '../../SearchContext.js'

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
    const unchanged = !value.query && !value.hideStatuses.length
    const isTag = !!value.query && isTagExpression(value.query)
    return {
      query: value.query,
      hideStatuses: value.hideStatuses,
      unchanged,
      searchTerm: value.query && !isTag ? value.query : undefined,
      tagExpression: isTag ? parse(value.query) : undefined,
      update: (newValues: Partial<SearchState>) => {
        onChange({ ...value, ...newValues })
      },
    }
  }, [value, onChange])
  return <SearchQueryContext.Provider value={contextValue}>{children}</SearchQueryContext.Provider>
}
