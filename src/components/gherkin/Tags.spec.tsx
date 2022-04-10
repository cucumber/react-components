import React from 'react'

import { render } from '../../../test-utils'
import { Tags } from './Tags'

describe('Tags', () => {
  it('doesnt render anything if no tags', () => {
    const { container } = render(<Tags tags={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders if we really have some tags', () => {
    const tags = [
      {
        location: {
          line: 1,
        },
        name: '@foo',
        id: '1',
      },
      {
        location: {
          line: 3,
        },
        name: '@bar',
        id: '2',
      },
    ]
    const { asFragment } = render(<Tags tags={tags} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
