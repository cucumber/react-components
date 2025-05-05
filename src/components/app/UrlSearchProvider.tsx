import { TestStepResultStatus } from '@cucumber/messages'
import React, { FC, PropsWithChildren, useCallback, useState } from 'react'

import { SearchState } from '../../SearchContext.js'
import { ControlledSearchProvider } from './ControlledSearchProvider.js'

interface Props {
  queryKey?: string
  hideKey?: string
}

export const UrlSearchProvider: FC<PropsWithChildren<Props>> = ({
  queryKey = 'query',
  hideKey = 'hide',
  children,
}) => {
  const [value, setValue] = useState<SearchState>(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      query: params.get(queryKey) ?? '',
      hideStatuses: params.getAll(hideKey).map((s) => s.toUpperCase() as TestStepResultStatus),
    }
  })
  const onChange = useCallback(
    (newValue: SearchState) => {
      setValue(newValue)
      const url = new URL(window.location.toString())
      if (newValue.query) {
        url.searchParams.set(queryKey, newValue.query)
      } else {
        url.searchParams.delete(queryKey)
      }
      url.searchParams.delete(hideKey)
      newValue.hideStatuses.forEach((s) => url.searchParams.append(hideKey, s.toLowerCase()))
      window.history.replaceState({}, '', url)
    },
    [queryKey, hideKey]
  )
  return (
    <ControlledSearchProvider value={value} onChange={onChange}>
      {children}
    </ControlledSearchProvider>
  )
}
