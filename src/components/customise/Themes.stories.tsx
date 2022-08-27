import * as messages from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import attachments from '../../../acceptance/attachments/attachments.feature'
import rules from '../../../acceptance/rules/rules.feature'
import { EnvelopesWrapper, GherkinDocumentList } from '../app'
import { CucumberReact } from '../CucumberReact'
import { IncludedTheme } from './theming'

export default {
  title: 'Customisation/Themes',
}

export const Themes: Story<{ envelopes: messages.Envelope[]; theme: IncludedTheme }> = ({
  envelopes,
  theme,
}) => {
  return (
    <>
      <h2>`{theme}` Theme</h2>
      <CucumberReact theme={theme}>
        <EnvelopesWrapper envelopes={envelopes}>
          <GherkinDocumentList />
        </EnvelopesWrapper>
      </CucumberReact>
    </>
  )
}
Themes.args = {
  envelopes: [...(attachments as messages.Envelope[]), ...(rules as messages.Envelope[])],
  theme: 'dark',
}
