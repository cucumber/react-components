import React from 'react'

import { render } from '../../../test-utils'
import { Description } from './index'

describe('Description', () => {
  it('doesnt render anything if description empty', () => {
    const { container } = render(<Description description={''} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('doesnt render anything if description is just whitespace', () => {
    const { container } = render(<Description description={'  '} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('doesnt render anything if description is just whitespace including newlines', () => {
    const { container } = render(
      <Description
        description={`
    
    `}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders if we really have a description', () => {
    const { getByRole } = render(<Description description={'## This is a heading'} />)
    expect(getByRole('heading', { name: 'This is a heading' })).toBeVisible()
  })

  it('honours single line breaks in descriptions', () => {
    const description = `As a user
I want to do stuff
So that I can be happy`
    const { container } = render(<Description description={description} />)
    expect(container).toContainHTML(
      '<p>As a user<br>I want to do stuff<br>So that I can be happy</p>'
    )
  })
})
