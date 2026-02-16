import type { Envelope } from '@cucumber/messages'
import type { Story } from '@ladle/react'
import React from 'react'

import emptySample from '../../../acceptance/empty/empty.js'
import globalHooksAfterAllErrorSample from '../../../acceptance/global-hooks-afterall-error/global-hooks-afterall-error.js'
import globalHooksAttachmentsSample from '../../../acceptance/global-hooks-attachments/global-hooks-attachments.js'
import globalHooksBeforeAllErrorSample from '../../../acceptance/global-hooks-beforeall-error/global-hooks-beforeall-error.js'
import globalHooksSample from '../../../acceptance/global-hooks/global-hooks.js'
import { TestRunHooks } from './TestRunHooks.js'
import { EnvelopesProvider } from './index.js'

type TemplateArgs = {
  envelopes: readonly Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesProvider envelopes={envelopes}>
      <TestRunHooks />
    </EnvelopesProvider>
  )
}

export default {
  title: 'App/TestRunHooks',
}

export const Empty = Template.bind({})
Empty.args = {
  envelopes: emptySample,
}

export const Default = Template.bind({})
Default.args = {
  envelopes: globalHooksSample,
}

export const WithAttachments = Template.bind({})
WithAttachments.args = {
  envelopes: globalHooksAttachmentsSample,
}

export const BeforeAllError = Template.bind({})
BeforeAllError.args = {
  envelopes: globalHooksBeforeAllErrorSample,
}

export const AfterAllError = Template.bind({})
AfterAllError.args = {
  envelopes: globalHooksAfterAllErrorSample,
}
