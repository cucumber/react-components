import * as messages from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import testData from '../../../acceptance/examples-tables/examples-tables.feature.js'
import targetedRun from '../../../samples/targeted-run.js'
import { CucumberReact } from '../CucumberReact.js'
import { EnvelopesWrapper } from './EnvelopesWrapper.js'
import { FilteredResults } from './FilteredResults.js'
import { SearchWrapper } from './SearchWrapper.js'

export default {
  title: 'App/FilteredResults',
}

type TemplateArgs = {
  envelopes: readonly messages.Envelope[]
  experimental?: boolean
}

const Template: Story<TemplateArgs> = ({ envelopes, experimental }) => {
  return (
    <CucumberReact>
      <EnvelopesWrapper envelopes={envelopes}>
        <SearchWrapper>
          <FilteredResults experimental={experimental} />
        </SearchWrapper>
      </EnvelopesWrapper>
    </CucumberReact>
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

export const Experimental = Template.bind({})
Experimental.args = {
  envelopes: testData,
  experimental: true,
}

export const TargetedRunExperimental = Template.bind({})
TargetedRunExperimental.args = {
  envelopes: targetedRun,
  experimental: true,
}
