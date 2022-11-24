import * as messages from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import testData from '../../../acceptance/examples-tables/examples-tables.feature'
import targetedRun from '../../../test-utils/messages/filtered-pickles'
import { CucumberReact } from '../CucumberReact'
import { EnvelopesWrapper } from './EnvelopesWrapper'
import { FilteredResults } from './FilteredResults'
import { SearchWrapper } from './SearchWrapper'

export default {
  title: 'App/FilteredResults',
}

type TemplateArgs = {
  envelopes: readonly messages.Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <CucumberReact>
      <EnvelopesWrapper envelopes={envelopes}>
        <SearchWrapper>
          <FilteredResults />
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
