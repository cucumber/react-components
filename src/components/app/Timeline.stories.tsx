import type { Envelope } from '@cucumber/messages'
import type { Story } from '@ladle/react'
import examplesTables from '../../../acceptance/examples-tables/examples-tables.js'
import parallel from '../../../acceptance/parallel/parallel.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { InMemorySearchProvider } from './InMemorySearchProvider.js'
import { Timeline } from './Timeline.js'

export default {
  title: 'App/Timeline',
}

type TemplateArgs = {
  envelopes: readonly Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesProvider envelopes={envelopes}>
      <InMemorySearchProvider>
        <Timeline />
      </InMemorySearchProvider>
    </EnvelopesProvider>
  )
}

export const SingleProcess = Template.bind({})
SingleProcess.args = {
  envelopes: examplesTables,
} as TemplateArgs

export const Parallel = Template.bind({})
Parallel.args = {
  envelopes: parallel,
} as TemplateArgs

export const NoTestCases = Template.bind({})
NoTestCases.args = {
  envelopes: [],
} as TemplateArgs
