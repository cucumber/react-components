import * as messages from '@cucumber/messages'
import { Story } from '@ladle/react'
import React, { FC } from 'react'

import attachments from '../../../acceptance/attachments/attachments.feature.js'
import dataTables from '../../../acceptance/data-tables/data-tables.feature.js'
import examplesTables from '../../../acceptance/examples-tables/examples-tables.feature.js'
import hooks from '../../../acceptance/hooks/hooks.feature.js'
import markdown from '../../../acceptance/markdown/markdown.feature.md.js'
import minimal from '../../../acceptance/minimal/minimal.feature.js'
import parameterTypes from '../../../acceptance/parameter-types/parameter-types.feature.js'
import pending from '../../../acceptance/pending/pending.feature.js'
import retry from '../../../acceptance/retry/retry.feature.js'
import rules from '../../../acceptance/rules/rules.feature.js'
import skipped from '../../../acceptance/skipped/skipped.feature.js'
import stacktTraces from '../../../acceptance/stack-traces/stack-traces.feature.js'
import undefinedEnvelopes from '../../../acceptance/undefined/undefined.feature.js'
import unknownParameterTypes from '../../../acceptance/unknown-parameter-type/unknown-parameter-type.feature.js'
import { useQueries } from '../../hooks/index.js'
import { EnvelopesWrapper } from '../app/index.js'
import { CucumberReact } from '../CucumberReact.js'
import { TestCaseOutcomes } from './TestCaseOutcomes.js'

export default {
  title: 'Results/TestCaseOutcomes',
}

type TemplateArgs = {
  envelopes: readonly messages.Envelope[]
}

const Wrapper: FC = () => {
  const { cucumberQuery } = useQueries()
  return <TestCaseOutcomes testCases={cucumberQuery.findAllTestCaseStarted()} />
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <CucumberReact>
      <EnvelopesWrapper envelopes={envelopes}>
        <Wrapper />
      </EnvelopesWrapper>
    </CucumberReact>
  )
}

export const Attachments = Template.bind({})
Attachments.args = {
  envelopes: attachments,
}

export const DataTables = Template.bind({})
DataTables.args = {
  envelopes: dataTables,
}

export const ExamplesTables = Template.bind({})
ExamplesTables.args = {
  envelopes: examplesTables,
}

export const Hooks = Template.bind({})
Hooks.args = {
  envelopes: hooks,
}

export const Markdown = Template.bind({})
Markdown.args = {
  envelopes: markdown,
}

export const Minimal = Template.bind({})
Minimal.args = {
  envelopes: minimal,
}

export const ParameterTypes = Template.bind({})
ParameterTypes.args = {
  envelopes: parameterTypes,
}

export const Pending = Template.bind({})
Pending.args = {
  envelopes: pending,
}

export const Retry = Template.bind({})
Retry.args = {
  envelopes: retry,
}

export const Rules = Template.bind({})
Rules.args = {
  envelopes: rules,
}

export const Skipped = Template.bind({})
Skipped.args = {
  envelopes: skipped,
}

export const StackTraces = Template.bind({})
StackTraces.args = {
  envelopes: stacktTraces,
}

export const Undefined = Template.bind({})
Undefined.args = {
  envelopes: undefinedEnvelopes,
}

export const UnknownParameterTypes = Template.bind({})
UnknownParameterTypes.args = {
  envelopes: unknownParameterTypes,
}
