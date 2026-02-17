import type { Envelope } from '@cucumber/messages'
import type { Story } from '@ladle/react'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { StatusesSummary } from './StatusesSummary.js'

export default {
  title: 'App/StatusesSummary',
}

type TemplateArgs = {
  envelopes: readonly Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesProvider envelopes={envelopes}>
      <StatusesSummary />
    </EnvelopesProvider>
  )
}

export const Typical = Template.bind({})
Typical.args = {
  envelopes: examplesTablesFeature,
} as TemplateArgs
