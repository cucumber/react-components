import { render } from '@testing-library/react'
import { expect } from 'chai'

import { Tags } from './Tags.js'

describe('Tags', () => {
  it('doesnt render anything if no tags', () => {
    const { container } = render(<Tags tags={[]} />)
    expect(container).to.be.empty
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
    const { container } = render(<Tags tags={tags} />)
    expect(container).to.contain.text('@foo')
    expect(container).to.contain.text('@bar')
  })
})
