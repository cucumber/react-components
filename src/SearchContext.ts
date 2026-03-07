import type { TestStepResultStatus as Status } from '@cucumber/messages'
import type { Node } from '@cucumber/tag-expressions'
import { createContext } from 'react'

export interface SearchState {
  readonly query: string
  readonly hideStatuses: readonly Status[]
}

export interface SearchContextValue extends SearchState {
  unchanged: boolean
  searchTerm: string | undefined
  tagExpression: Node | undefined
  update: (changes: Partial<SearchState>) => void
}

export default createContext<SearchContextValue>({
  query: '',
  hideStatuses: [],
  unchanged: true,
  searchTerm: undefined,
  tagExpression: undefined,
  update: () => {},
})
