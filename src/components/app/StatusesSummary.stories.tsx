import * as messages from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.feature.js'
import { EnvelopesWrapper } from './EnvelopesWrapper.js'
import { StatusesSummary } from './StatusesSummary.js'

export default {
  title: 'App/StatusesSummary',
}

type TemplateArgs = {
  envelopes: readonly messages.Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesWrapper envelopes={envelopes}>
      <StatusesSummary />
    </EnvelopesWrapper>
  )
}

export const Typical = Template.bind({})
Typical.args = {
  envelopes: examplesTablesFeature,
} as TemplateArgs
