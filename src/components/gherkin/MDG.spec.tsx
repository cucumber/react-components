import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import { render } from '@testing-library/react'
import React from 'react'

import markdown from '../../../acceptance/markdown/markdown.feature.md'
import { EnvelopesQuery } from '../../EnvelopesQueryContext'
import UriContext from '../../UriContext'
import { QueriesWrapper } from '../app'
import { MDG } from './MDG'

describe('<MDG/>', () => {
  it(`can render markdown as MDG`, async () => {
    const envelopes = markdown as readonly messages.Envelope[]
    const source = envelopes.find((e) => e.source)!.source!

    render(
      <QueriesWrapper {...props(envelopes)}>
        <UriContext.Provider value={source.uri}>
          <MDG uri={source.uri}>{source.data}</MDG>
        </UriContext.Provider>
      </QueriesWrapper>
    )
  })
})

function props(envelopes: readonly messages.Envelope[]) {
  const gherkinQuery = new GherkinQuery()
  const cucumberQuery = new CucumberQuery()
  const envelopesQuery = new EnvelopesQuery()
  for (const envelope of envelopes) {
    gherkinQuery.update(envelope)
    cucumberQuery.update(envelope)
    envelopesQuery.update(envelope)
  }
  return { gherkinQuery, cucumberQuery, envelopesQuery }
}
