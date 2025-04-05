import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import React, { FunctionComponent, PropsWithChildren, useMemo } from 'react'

import { QueriesWrapper } from './QueriesWrapper.js'

interface IProps {
  envelopes: readonly messages.Envelope[]
}

export const EnvelopesWrapper: FunctionComponent<PropsWithChildren<IProps>> = ({
  envelopes,
  children,
}) => {
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
    <QueriesWrapper gherkinQuery={gherkinQuery} cucumberQuery={cucumberQuery}>
      {children}
    </QueriesWrapper>
  )
}
