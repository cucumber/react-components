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
  title: 'Gherkin/Attachment',
}

type TemplateArgs = AttachmentProps

const Template: Story<TemplateArgs> = ({ attachment }) => {
  return (
    <CucumberReact>
      <Attachment attachment={attachment} />
    </CucumberReact>
  )
}

export const Log = Template.bind({})
Log.args = {
  attachment: {
    mediaType: 'text/x.cucumber.log+plain',
    contentEncoding: AttachmentContentEncoding.IDENTITY,
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
} satisfies AttachmentProps

export const ExternalisedImage = Template.bind({})
ExternalisedImage.storyName = 'Externalised image'
ExternalisedImage.args = {
  attachment: {
    mediaType: 'image/svg+xml',
    contentEncoding: AttachmentContentEncoding.IDENTITY,
    body: '',
    url: externalisedImageUrl,
  },
} satisfies AttachmentProps

export const ExternalisedText = Template.bind({})
ExternalisedText.storyName = 'Externalised text'
ExternalisedText.args = {
  attachment: {
    mediaType: 'application/json',
    contentEncoding: AttachmentContentEncoding.IDENTITY,
    body: '',
    url: externalisedTextUrl,
  },
} satisfies AttachmentProps

export const Externalised404 = Template.bind({})
Externalised404.storyName = 'Externalised 404'
Externalised404.args = {
  attachment: {
    mediaType: 'application/json',
    contentEncoding: AttachmentContentEncoding.IDENTITY,
    body: '',
    url: '/this-leads-nowhere.json',
  },
} satisfies AttachmentProps

export const ExternalisedCors = Template.bind({})
ExternalisedCors.storyName = 'Externalised CORS error'
ExternalisedCors.args = {
  attachment: {
    mediaType: 'application/json',
    contentEncoding: AttachmentContentEncoding.IDENTITY,
    body: '',
    url: 'https://cucumber.io',
  },
} satisfies AttachmentProps
