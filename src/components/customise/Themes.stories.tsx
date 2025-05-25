import './CustomRendering.stories.scss'

import * as messages from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import attachments from '../../../acceptance/attachments/attachments.feature.js'
import { EnvelopesProvider, FilteredDocuments } from '../app/index.js'

export default {
  title: 'Customisation/Themes',
}

export const Themes: Story<{ envelopes: readonly messages.Envelope[]; theme: string }> = ({
  envelopes,
  theme,
}) => {
  return (
    <>
      <h2>{theme} Theme</h2>
      <div className={`${theme}-theme`}>
        <EnvelopesProvider envelopes={envelopes}>
          <FilteredDocuments />
        </EnvelopesProvider>
      </div>
    </>
  )
}

Themes.args = {
  envelopes: attachments,
  theme: 'dark',
}
