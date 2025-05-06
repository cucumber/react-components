import * as messages from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import testData from '../../../acceptance/examples-tables/examples-tables.feature.js'
import targetedRun from '../../../samples/targeted-run.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { FilteredResults } from './FilteredResults.js'
import { InMemorySearchProvider } from './InMemorySearchProvider.js'

export default {
  title: 'App/FilteredResults',
}

type TemplateArgs = {
  envelopes: readonly messages.Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesProvider envelopes={envelopes}>
      <InMemorySearchProvider>
        <FilteredResults />
      </InMemorySearchProvider>
    </EnvelopesProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  envelopes: testData,
}

export const TargetedRun = Template.bind({})
TargetedRun.args = {
  envelopes: targetedRun,
}
