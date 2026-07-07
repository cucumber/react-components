import { type Envelope, type TestCaseStarted, TimeConversion } from '@cucumber/messages'
import type { Story } from '@ladle/react'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.js'
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
  envelopes: examplesTablesFeature,
} as TemplateArgs

export const Parallel = Template.bind({})
Parallel.args = {
  envelopes: distributeAcrossWorkers(examplesTablesFeature, 3),
} as TemplateArgs

export const NoTestCases = Template.bind({})
NoTestCases.args = {
  envelopes: [
    { testRunStarted: { timestamp: TimeConversion.millisecondsSinceEpochToTimestamp(0) } },
    {
      testRunFinished: {
        timestamp: TimeConversion.millisecondsSinceEpochToTimestamp(1000),
        success: true,
      },
    },
  ],
} as TemplateArgs

/**
 * Cucumber implementations report which worker ran a test case via
 * `TestCaseStarted.workerId`. The compatibility-kit fixtures used in this story
 * were captured from a single-process run so this helper distributes the
 * existing test cases across a number of synthetic workers to demonstrate how
 * the timeline renders parallel execution.
 */
function distributeAcrossWorkers(
  envelopes: ReadonlyArray<Envelope>,
  workerCount: number
): ReadonlyArray<Envelope> {
  let index = 0
  return envelopes.map((envelope): Envelope => {
    if (!envelope.testCaseStarted) {
      return envelope
    }
    const workerId = String(index % workerCount)
    index += 1
    const testCaseStarted: TestCaseStarted = { ...envelope.testCaseStarted, workerId }
    return { ...envelope, testCaseStarted }
  })
}
