import * as messages from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import empty from '../../../acceptance/empty/empty.js'
import globalHooksAfterAllError from '../../../acceptance/global-hooks-afterall-error/global-hooks-afterall-error.js'
import globalHooksAttachments from '../../../acceptance/global-hooks-attachments/global-hooks-attachments.js'
import globalHooksBeforeAllError from '../../../acceptance/global-hooks-beforeall-error/global-hooks-beforeall-error.js'
import { EnvelopesProvider, FilteredDocuments } from './index.js'
import { TestRunHooks } from './TestRunHooks.js'

type TemplateArgs = {
  envelopes: readonly messages.Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesProvider envelopes={envelopes}>
      <FilteredDocuments />
      <h2>BeforeAll/AfterAll</h2>
      <TestRunHooks />
    </EnvelopesProvider>
  )
}

export default {
  title: 'App/TestRunHooksList',
}

export const EmptyGlobalHooks = Template.bind({})
EmptyGlobalHooks.args = {
  envelopes: empty,
}

export const GlobalHooksWithAttachments = Template.bind({})
GlobalHooksWithAttachments.args = {
  envelopes: globalHooksAttachments,
}

export const GlobalHooksBeforeAllError = Template.bind({})
GlobalHooksBeforeAllError.args = {
  envelopes: globalHooksBeforeAllError,
}

export const GlobalHooksAfterAllError = Template.bind({})
GlobalHooksAfterAllError.args = {
  envelopes: globalHooksAfterAllError,
}
