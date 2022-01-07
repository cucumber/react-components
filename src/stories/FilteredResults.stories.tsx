import * as messages from '@cucumber/messages'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import testData from '../../acceptance/examples-tables/examples-tables.feature'
import { components } from '../../src'
import { CucumberReact } from '../components'

const { EnvelopesWrapper, SearchWrapper, FilteredResults } = components.app

export default {
  title: 'App/FilteredResults',
  component: components.app.FilteredResults,
} as Meta

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
