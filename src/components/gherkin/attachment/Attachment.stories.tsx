import { AttachmentContentEncoding } from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import { CucumberReact } from '../../CucumberReact.js'
import { AttachmentProps } from '../../customise/index.js'
import { Attachment } from './Attachment.js'
// @ts-expect-error vite static asset import
import externalisedImageUrl from './fixture-image.svg?url'
// @ts-expect-error vite static asset import
import externalisedTextUrl from './fixture-text.json?url'

export default {
  title: 'Attachments/Attachments',
}

type TemplateArgs = AttachmentProps

const Template: Story<TemplateArgs> = ({ attachment }) => {
  return (
    <CucumberReact>
      <Attachment attachment={attachment} />
    </CucumberReact>
  )
}

export const ExternalisedImage = Template.bind({})
ExternalisedImage.args = {
  attachment: {
    mediaType: 'image/svg+xml',
    contentEncoding: AttachmentContentEncoding.IDENTITY,
    body: '',
    url: externalisedImageUrl,
  },
} satisfies AttachmentProps

export const ExternalisedText = Template.bind({})
ExternalisedText.args = {
  attachment: {
    mediaType: 'application/json',
    contentEncoding: AttachmentContentEncoding.IDENTITY,
    body: '',
    url: externalisedTextUrl,
  },
} satisfies AttachmentProps
