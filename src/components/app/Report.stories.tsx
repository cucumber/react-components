import { Envelope } from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import examplesTablesSample from '../../../acceptance/examples-tables/examples-tables.js'
import globalHooksSample from '../../../acceptance/global-hooks/global-hooks.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { InMemorySearchProvider } from './InMemorySearchProvider.js'
import { Report } from './Report.js'

type TemplateArgs = {
  envelopes: readonly Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesProvider envelopes={envelopes}>
      <InMemorySearchProvider>
        <Report />
      </InMemorySearchProvider>
    </EnvelopesProvider>
  )
}

export default {
  title: 'App/Report',
}

export const Default = Template.bind({})
Default.args = {
  envelopes: examplesTablesSample,
} as TemplateArgs

export const WithGlobalHooks = Template.bind({})
WithGlobalHooks.args = {
  envelopes: globalHooksSample,
} as TemplateArgs