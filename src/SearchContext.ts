import type { TestStepResultStatus as Status } from '@cucumber/messages'
import type { Node } from '@cucumber/tag-expressions'
import { createContext } from 'react'

export interface SearchState {
  readonly query: string
  readonly hideStatuses: readonly Status[]
}

export interface SearchOperations {
  update: (changes: Partial<SearchState>) => void
}

export interface FilterCriteria {
  readonly hideStatuses: readonly Status[]
  readonly searchTerm?: string
  readonly tagExpression?: Node
  readonly unchanged: boolean
}

export type SearchContextValue = SearchState & SearchOperations & FilterCriteria

export default createContext<SearchContextValue>({
  query: '',
  hideStatuses: [],
  unchanged: true,
  searchTerm: undefined,
  tagExpression: undefined,
  update: () => {},
})
