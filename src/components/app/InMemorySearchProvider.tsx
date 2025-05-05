import { TestStepResultStatus } from '@cucumber/messages'
import React, { FC, PropsWithChildren, useState } from 'react'

import { SearchState } from '../../SearchContext.js'
import { ControlledSearchProvider } from './ControlledSearchProvider.js'

interface Props {
  defaultQuery?: string
  defaultHideStatuses?: readonly TestStepResultStatus[]
}

export const InMemorySearchProvider: FC<PropsWithChildren<Props>> = ({
  defaultQuery = '',
  defaultHideStatuses = [],
  children,
}) => {
  const [value, setValue] = useState<SearchState>({
    query: defaultQuery,
    hideStatuses: defaultHideStatuses,
  })
  return (
    <ControlledSearchProvider value={value} onChange={setValue}>
      {children}
    </ControlledSearchProvider>
  )
}
