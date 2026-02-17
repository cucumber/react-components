import './CustomRendering.stories.scss'

import type { DocString as DocStringMessage } from '@cucumber/messages'
import type { Story } from '@ladle/react'

import { DocString } from '../gherkin/index.js'
import { CustomRendering, type CustomRenderingSupport } from './CustomRendering.js'

export default {
  title: 'Customisation/Classes',
}

export const Classes: Story<{ support: CustomRenderingSupport; docString: DocStringMessage }> = ({
  support,
  docString,
}) => {
  return (
    <>
      <h2>Default DocString:</h2>
      <DocString docString={docString} />
      <h2>With Custom Classes:</h2>
      <CustomRendering overrides={support}>
        <DocString docString={docString} />
      </CustomRendering>
    </>
  )
}
Classes.args = {
  docString: {
    location: {
      column: 1,
      line: 1,
    },
    content: "Hello world, I'm a doc string!",
    delimiter: '`',
  },
  support: {
    DocString: {
      docString: 'custom-docstring',
    },
  },
}
