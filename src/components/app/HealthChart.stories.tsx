import { Envelope } from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.feature.js'
import { EnvelopesWrapper } from './EnvelopesWrapper.js'
import { HealthChart } from './HealthChart.js'

export default {
  title: 'App/HealthChart',
}

type TemplateArgs = {
  envelopes: readonly Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesWrapper envelopes={envelopes}>
      <HealthChart />
    </EnvelopesWrapper>
  )
}

export const Typical = Template.bind({})
Typical.args = {
  envelopes: examplesTablesFeature,
} as TemplateArgs
