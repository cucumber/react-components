import * as messages from '@cucumber/messages'
import assert from 'assert'
import React from 'react'

import { render } from '../../../test/components/utils'
import { Tags } from '../gherkin'
import { CucumberReact } from '../index'
import { Customised, TagsClasses, TagsProps } from './index'

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

    expect(getByRole('list')).toHaveClass('tags')
    expect(getByRole('listitem')).toHaveClass('tag')
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

    expect(getByRole('list')).toHaveClass('custom-list-class')
    expect(getByRole('listitem')).toHaveClass('custom-item-class')
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

    expect(getByRole('list')).toHaveClass('custom-list-class')
    expect(getByRole('listitem')).toHaveClass('tag')
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

    expect(container).toContainHTML('<p>Totally custom!</p>')
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

    expect(getByRole('list')).toHaveClass('tags')
    expect(getByRole('listitem')).toHaveClass('tag')
  })
})
