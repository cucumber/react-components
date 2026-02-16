import type * as messages from '@cucumber/messages'
import type { Story } from '@ladle/react'
import React from 'react'

import { Feature, Tags } from '../gherkin/index.js'
import { CustomRendering, type CustomRenderingSupport, type TagsProps } from './CustomRendering.js'

export default {
  title: 'Customisation/Components',
}

export const CustomTagComponent: Story<{
  support: CustomRenderingSupport
  tags: messages.Tag[]
}> = ({ support, tags }) => {
  return (
    <>
      <h2>Tags with JIRA linking</h2>
      <CustomRendering overrides={support}>
        <Tags tags={tags} />
      </CustomRendering>
    </>
  )
}

CustomTagComponent.args = {
  tags: [
    {
      location: {
        column: 1,
        line: 1,
      },
      name: '@foo',
      id: '1',
    },
    {
      location: {
        column: 1,
        line: 1,
      },
      name: '@bar',
      id: '1',
    },
    {
      location: {
        column: 1,
        line: 1,
      },
      name: '@PRODUCT-12345',
      id: '1',
    },
  ],
  support: {
    Tags: (props: TagsProps) => (
      <ul>
        {props.tags.map((tag, i) => {
          if (tag.name.match(/^@[A-Z]+-[0-9]+$/)) {
            return (
              <li key={i}>
                <a href={`https://jira.fake.co/${tag.name.substr(1)}`}>{tag.name}</a>
              </li>
            )
          }
          return <li key={i}>{tag.name}</li>
        })}
      </ul>
    ),
  },
}

export const CustomFeatureComponent: Story<{
  support: CustomRenderingSupport
  feature: messages.Feature
}> = ({ support, feature }) => {
  return (
    <>
      <h2>Feature with button on top</h2>
      <CustomRendering overrides={support}>
        <Feature feature={feature} />
      </CustomRendering>
    </>
  )
}

CustomFeatureComponent.args = {
  feature: {
    keyword: 'Feature',
    name: 'My feature',
    children: [],
    tags: [],
    location: {
      column: 1,
      line: 1,
    },
    description: 'This\nis\nthe\ndescription',
    language: 'en',
  },
  support: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Feature: (props: any) => (
      <div>
        <button>Click me</button>
        <props.DefaultRenderer {...props} />
      </div>
    ),
  },
}
