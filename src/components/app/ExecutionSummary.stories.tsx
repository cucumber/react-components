import * as messages from '@cucumber/messages'
import { TestRunFinished, TestRunStarted, TimeConversion } from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.feature.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { ExecutionSummary } from './ExecutionSummary.js'

const metaMinimal: messages.Meta = {
  protocolVersion: '17.1.1',
  implementation: { version: '8.0.0-rc.1', name: 'cucumber-js' },
  cpu: { name: 'x64' },
  os: { name: 'linux', version: '5.11.0-1022-azure' },
  runtime: { name: 'node.js', version: '16.13.1' },
  ci: undefined,
}

const metaWithCi: messages.Meta = {
  ...metaMinimal,
  ci: {
    name: 'GitHub Actions',
    url: 'https://github.com/cucumber/cucumber-js/actions/runs/1592557391',
    buildNumber: '1592557391',
    git: {
      revision: 'b53d820504b31c8e4d44234dc5eaa58d6b7fdd4c',
      remote: 'https://github.com/cucumber/cucumber-js.git',
      branch: 'main',
    },
  },
}

const testRunStarted: TestRunStarted = {
  timestamp: TimeConversion.millisecondsSinceEpochToTimestamp(1639753096000),
}

const testRunFinished: TestRunFinished = {
  timestamp: TimeConversion.millisecondsSinceEpochToTimestamp(1639753197000),
  success: false,
}

export default {
  title: 'App/ExecutionSummary',
}

type TemplateArgs = {
  envelopes: readonly messages.Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesProvider envelopes={envelopes}>
      <ExecutionSummary />
    </EnvelopesProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  envelopes: [...examplesTablesFeature, { meta: metaMinimal }],
} as TemplateArgs

export const WithCi = Template.bind({})
WithCi.args = {
  envelopes: [...examplesTablesFeature, { meta: metaWithCi }],
} as TemplateArgs

export const NoTestCases = Template.bind({})
NoTestCases.args = {
  envelopes: [{ testRunStarted }, { testRunFinished }, { meta: metaMinimal }],
} as TemplateArgs
