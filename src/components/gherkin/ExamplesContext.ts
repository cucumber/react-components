import { Pickle } from '@cucumber/messages'
import { createContext } from 'react'

export const ExamplesContext = createContext<{
  setSelectedExample: (pickle?: Pickle) => void
}>({
  setSelectedExample: () => undefined,
})
