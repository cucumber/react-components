import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { Envelope } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import React, { FC, PropsWithChildren, useMemo } from 'react'

import { QueriesProvider } from './QueriesProvider.js'

interface Props {
  envelopes: readonly Envelope[]
}

export const EnvelopesProvider: FC<PropsWithChildren<Props>> = ({ envelopes, children }) => {
  const { gherkinQuery, cucumberQuery } = useMemo(() => {
    const gherkinQuery = new GherkinQuery()
    const cucumberQuery = new CucumberQuery()
    for (const envelope of envelopes) {
      gherkinQuery.update(envelope)
      cucumberQuery.update(envelope)
    }
    return { gherkinQuery, cucumberQuery }
  }, [envelopes])
  return (
    <QueriesProvider gherkinQuery={gherkinQuery} cucumberQuery={cucumberQuery}>
      {children}
    </QueriesProvider>
  )
}
