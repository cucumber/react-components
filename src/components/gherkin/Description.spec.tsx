import { render } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'

import { Description } from './index.js'

describe('Description', () => {
  it('doesnt render anything if description empty', () => {
    const { container } = render(<Description description={''} />)
    expect(container).to.be.empty
  })

  it('doesnt render anything if description is just whitespace', () => {
    const { container } = render(<Description description={'  '} />)
    expect(container).to.be.empty
  })

  it('doesnt render anything if description is just whitespace including newlines', () => {
    const { container } = render(
      <Description
        description={`
    
    `}
      />
    )
    expect(container).to.be.empty
  })

  it('renders if we really have a description', () => {
    const { getByRole } = render(<Description description={'## This is a heading'} />)
    expect(getByRole('heading', { name: 'This is a heading' })).to.be.visible
  })

  it('honours single line breaks in descriptions', () => {
    const description = `As a user
I want to do stuff
So that I can be happy`
    const { container } = render(<Description description={description} />)
    expect(container).to.contain.html(
      '<p>As a user<br>\nI want to do stuff<br>\nSo that I can be happy</p>'
    )
  })
})
