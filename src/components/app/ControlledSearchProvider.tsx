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
    return {
      query: value.query,
      hideStatuses: value.hideStatuses,
      unchanged,
      ...deriveState(value.query),
      update: (newValues: Partial<SearchState>) => {
        onChange({ ...value, ...newValues })
      },
    }
  }, [value, onChange])
  return <SearchQueryContext.Provider value={contextValue}>{children}</SearchQueryContext.Provider>
}

function deriveState(query: string): Pick<SearchContextValue, 'searchTerm' | 'tagExpression'> {
  if (!query) {
    return {}
  }
  if (isTagExpression(query)) {
    try {
      return {
        tagExpression: parse(query),
      }
    } catch (error) {
      console.error(`Failed to parse tag expression "${query}":`, error)
    }
  }
  return {
    searchTerm: query,
  }
}
