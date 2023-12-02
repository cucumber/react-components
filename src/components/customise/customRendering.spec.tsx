import * as messages from '@cucumber/messages'
import { expect } from 'chai'
import React from 'react'

import { render } from '../../../test-utils/index.js'
import { Tags } from '../gherkin/index.js'
import { CucumberReact } from '../index.js'
import { Customised, TagsClasses, TagsProps } from './index.js'

describe('custom rendering and theming', () => {
  it('uses the generated class names from built-in styles by default', () => {
    const tags: messages.Tag[] = [
      {
        id: '123',
        name: 'sometag',
        location: {
          line: 1,
          column: 1,
        },
      },
    ]

    const { getByRole } = render(<Tags tags={tags} />)

    const byRole = getByRole('list')
    expect(byRole).to.have.class('tags')
    expect(getByRole('listitem')).to.have.class('tag')
  })

  it('uses the custom classnames provided via custom rendering', () => {
    const tags: messages.Tag[] = [
      {
        id: '123',
        name: 'sometag',
        location: {
          line: 1,
          column: 1,
        },
      },
    ]

    const { getByRole } = render(
      <CucumberReact
        customRendering={{
          Tags: {
            tags: 'custom-list-class',
            tag: 'custom-item-class',
          },
        }}
      >
        <Tags tags={tags} />
      </CucumberReact>
    )

    expect(getByRole('list')).to.have.class('custom-list-class')
    expect(getByRole('listitem')).to.have.class('custom-item-class')
  })

  it('uses a partial of custom classes and falls back to built-in styles where omitted', () => {
    const tags: messages.Tag[] = [
      {
        id: '123',
        name: 'sometag',
        location: {
          line: 1,
          column: 1,
        },
      },
    ]

    const { getByRole } = render(
      <CucumberReact
        customRendering={{
          Tags: {
            tags: 'custom-list-class',
          },
        }}
      >
        <Tags tags={tags} />
      </CucumberReact>
    )

    expect(getByRole('list')).to.have.class('custom-list-class')
    expect(getByRole('listitem')).to.have.class('tag')
  })

  it('uses a custom component implementation where provided', () => {
    const tags: messages.Tag[] = [
      {
        id: '123',
        name: 'sometag',
        location: {
          line: 1,
          column: 1,
        },
      },
    ]

    const CustomComponent = () => {
      return <p>Totally custom!</p>
    }

    const { container } = render(
      <CucumberReact
        customRendering={{
          Tags: CustomComponent,
        }}
      >
        <Tags tags={tags} />
      </CucumberReact>
    )

    expect(container).to.contain.html('<p>Totally custom!</p>')
  })

  it('a custom component can defer to the default renderer if it wants to', () => {
    const tags: messages.Tag[] = [
      {
        id: '123',
        name: 'sometag',
        location: {
          line: 1,
          column: 1,
        },
      },
    ]

    const CustomComponent: Customised<TagsProps, TagsClasses> = (props) => {
      return <props.DefaultRenderer {...props} />
    }

    const { getByRole } = render(
      <CucumberReact
        customRendering={{
          Tags: CustomComponent,
        }}
      >
        <Tags tags={tags} />
      </CucumberReact>
    )

    expect(getByRole('list')).to.have.class('tags')
    expect(getByRole('listitem')).to.have.class('tag')
  })
})
