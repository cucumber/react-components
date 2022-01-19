import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import React, { FunctionComponent, useMemo } from 'react'

import { EnvelopesQuery } from '../../EnvelopesQueryContext.js'
import { QueriesWrapper } from './QueriesWrapper.js'

interface IProps {
  envelopes: readonly messages.Envelope[]
}

export const EnvelopesWrapper: FunctionComponent<IProps> = ({ envelopes, children }) => {
  const { gherkinQuery, cucumberQuery, envelopesQuery } = useMemo(() => {
    const gherkinQuery = new GherkinQuery()
    const cucumberQuery = new CucumberQuery()
    const envelopesQuery = new EnvelopesQuery()
    for (const envelope of envelopes) {
      gherkinQuery.update(envelope)
      cucumberQuery.update(envelope)
      envelopesQuery.update(envelope)
    }
    return { gherkinQuery, cucumberQuery, envelopesQuery }
  }, [envelopes])
  return (
    <QueriesWrapper
      gherkinQuery={gherkinQuery}
      cucumberQuery={cucumberQuery}
      envelopesQuery={envelopesQuery}
    >
      {children}
    </QueriesWrapper>
  )
}
