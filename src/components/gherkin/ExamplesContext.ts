import { createContext } from 'react'

export const ExamplesContext = createContext<{
  setSelectedExample: (pickleId?: string) => void
}>({
  setSelectedExample: () => undefined,
})
