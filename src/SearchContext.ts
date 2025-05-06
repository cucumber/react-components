import { TestStepResultStatus as Status } from '@cucumber/messages'
import React from 'react'

export interface SearchState {
  readonly query: string
  readonly hideStatuses: readonly Status[]
}

export interface SearchContextValue extends SearchState {
  update: (changes: Partial<SearchState>) => void
}

export default React.createContext<SearchContextValue>({
  query: '',
  hideStatuses: [],
  update: () => {},
})
