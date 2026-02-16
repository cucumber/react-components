import type { Envelope } from '@cucumber/messages'
import type { Story } from '@ladle/react'
import React from 'react'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { HealthChart } from './HealthChart.js'

export default {
  title: 'App/HealthChart',
}

type TemplateArgs = {
  envelopes: readonly Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesProvider envelopes={envelopes}>
      <HealthChart />
    </EnvelopesProvider>
  )
}

export const Typical = Template.bind({})
Typical.args = {
  envelopes: examplesTablesFeature,
} as TemplateArgs
