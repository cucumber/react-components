import * as messages from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import markdown from '../../acceptance/markdown/markdown.feature.md'
import { components } from '../../src'
import { CucumberReact } from '../components'
import UriContext from '../UriContext'

const { EnvelopesWrapper } = components.app
const { MDG } = components.gherkin

export default {
  title: 'Gherkin/MDG',
}

type TemplateArgs = { envelopes: readonly messages.Envelope[] }

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  const source = envelopes.filter((envelope) => envelope.source)[0].source
  if (!source) throw new Error('No source')
  return (
    <CucumberReact>
      <EnvelopesWrapper envelopes={envelopes}>
        <UriContext.Provider value={source.uri}>
          <MDG uri={source.uri}>{source.data}</MDG>
        </UriContext.Provider>
      </EnvelopesWrapper>
    </CucumberReact>
  )
}

export const Markdown = Template.bind({})
Markdown.args = {
  envelopes: markdown,
}
