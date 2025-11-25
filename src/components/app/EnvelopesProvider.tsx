import { Envelope } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import React, { FC, PropsWithChildren, useMemo } from 'react'

import { QueriesProvider } from './QueriesProvider.js'

interface Props {
  envelopes: readonly Envelope[]
}

export const EnvelopesProvider: FC<PropsWithChildren<Props>> = ({ envelopes, children }) => {
  const  cucumberQuery  = useMemo(() => {
    const cucumberQuery = new CucumberQuery()
    for (const envelope of envelopes) {
      cucumberQuery.update(envelope)
    }
    return cucumberQuery
  }, [envelopes])
  return <QueriesProvider cucumberQuery={cucumberQuery}>{children}</QueriesProvider>
}
