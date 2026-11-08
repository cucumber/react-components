import type { Tag } from '@cucumber/messages'
import { render } from '@testing-library/react'
import { expect } from 'chai'

import { Tags } from '../gherkin/index.js'
import { type Customised, CustomRendering, type TagsClasses, type TagsProps } from './index.js'

const TotallyCustomTags = () => {
  return <p>Totally custom!</p>
}

const DeferringTags: Customised<TagsProps, TagsClasses> = (props) => {
  return <props.DefaultRenderer {...props} />
}

describe('custom rendering and theming', () => {
  it('uses the generated class names from built-in styles by default', () => {
    const tags: Tag[] = [
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
    const tags: Tag[] = [
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
      <CustomRendering
        overrides={{
          Tags: {
            tags: 'custom-list-class',
            tag: 'custom-item-class',
          },
        }}
      >
        <Tags tags={tags} />
      </CustomRendering>
    )

    expect(getByRole('list')).to.have.class('custom-list-class')
    expect(getByRole('listitem')).to.have.class('custom-item-class')
  })

  it('uses a partial of custom classes and falls back to built-in styles where omitted', () => {
    const tags: Tag[] = [
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
      <CustomRendering
        overrides={{
          Tags: {
            tags: 'custom-list-class',
          },
        }}
      >
        <Tags tags={tags} />
      </CustomRendering>
    )

    expect(getByRole('list')).to.have.class('custom-list-class')
    expect(getByRole('listitem')).to.have.class('tag')
  })

  it('uses a custom component implementation where provided', () => {
    const tags: Tag[] = [
      {
        id: '123',
        name: 'sometag',
        location: {
          line: 1,
          column: 1,
        },
      },
    ]

    const { container } = render(
      <CustomRendering
        overrides={{
          Tags: TotallyCustomTags,
        }}
      >
        <Tags tags={tags} />
      </CustomRendering>
    )

    expect(container).to.contain.html('<p>Totally custom!</p>')
  })

  it('a custom component can defer to the default renderer if it wants to', () => {
    const tags: Tag[] = [
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
      <CustomRendering
        overrides={{
          Tags: DeferringTags,
        }}
      >
        <Tags tags={tags} />
      </CustomRendering>
    )

    expect(getByRole('list')).to.have.class('tags')
    expect(getByRole('listitem')).to.have.class('tag')
  })
})
