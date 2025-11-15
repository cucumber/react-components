import * as messages from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import attachments from '../../../acceptance/attachments/attachments.js'
import backgrounds from '../../../acceptance/backgrounds/backgrounds.js'
import dataTables from '../../../acceptance/data-tables/data-tables.js'
import examplesTables from '../../../acceptance/examples-tables/examples-tables.js'
import hooks from '../../../acceptance/hooks/hooks.js'
import hooksAttachments from '../../../acceptance/hooks-attachment/hooks-attachment.js'
import hooksConditional from '../../../acceptance/hooks-conditional/hooks-conditional.js'
import markdown from '../../../acceptance/markdown/markdown.js'
import minimal from '../../../acceptance/minimal/minimal.js'
import parameterTypes from '../../../acceptance/parameter-types/parameter-types.js'
import pending from '../../../acceptance/pending/pending.js'
import retry from '../../../acceptance/retry/retry.js'
import rules from '../../../acceptance/rules/rules.js'
import rulesBackgrounds from '../../../acceptance/rules-backgrounds/rules-backgrounds.js'
import skipped from '../../../acceptance/skipped/skipped.js'
import stacktTraces from '../../../acceptance/stack-traces/stack-traces.js'
import undefinedEnvelopes from '../../../acceptance/undefined/undefined.js'
import unknownParameterTypes from '../../../acceptance/unknown-parameter-type/unknown-parameter-type.js'
import { EnvelopesProvider, FilteredDocuments } from '../app/index.js'

export default {
  title: 'Gherkin/GherkinDocument',
}

type TemplateArgs = {
  envelopes: readonly messages.Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesProvider envelopes={envelopes}>
      <FilteredDocuments />
    </EnvelopesProvider>
  )
}

export const Attachments = Template.bind({})
Attachments.args = {
  envelopes: attachments,
}

export const Backgrounds = Template.bind({})
Backgrounds.args = {
  envelopes: backgrounds,
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

export const HooksWithAttachments = Template.bind({})
HooksWithAttachments.args = {
  envelopes: hooksAttachments,
}

export const HooksConditional = Template.bind({})
HooksConditional.args = {
  envelopes: hooksConditional,
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

export const RulesWithBackgrounds = Template.bind({})
RulesWithBackgrounds.args = {
  envelopes: rulesBackgrounds,
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
