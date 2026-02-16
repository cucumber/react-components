import type * as messages from '@cucumber/messages'
import { render } from '@testing-library/react'
import { expect } from 'chai'

import { Background } from './index.js'

describe('Background', () => {
  const createBackground = (overrides: Partial<messages.Background> = {}): messages.Background => ({
    id: 'background-1',
    keyword: 'Background',
    name: '',
    description: '',
    location: { line: 1, column: 1 },
    steps: [],
    ...overrides,
  })

  it('doesnt render anything if both name and description are empty', () => {
    const background = createBackground({
      name: '',
      description: '',
    })
    const { container } = render(<Background background={background} />)
    expect(container).to.be.empty
  })

  it('doesnt render anything if both name and description are just whitespace', () => {
    const background = createBackground({
      name: '  ',
      description: '  ',
    })
    const { container } = render(<Background background={background} />)
    expect(container).to.be.empty
  })

  it('renders if name is not blank', () => {
    const background = createBackground({
      name: 'Setup data',
      description: '',
    })
    const { getByRole } = render(<Background background={background} />)
    expect(getByRole('heading', { name: /Background:\s*Setup data/ })).to.be.visible
  })

  it('renders if description is not blank', () => {
    const background = createBackground({
      name: '',
      description: 'This sets up the test data',
    })
    const { container } = render(<Background background={background} />)
    expect(container).to.contain.text('This sets up the test data')
  })

  it('renders both name and description when both are present', () => {
    const background = createBackground({
      name: 'Setup data',
      description: 'This sets up the test data',
    })
    const { getByRole, container } = render(<Background background={background} />)
    expect(getByRole('heading', { name: /Background:\s*Setup data/ })).to.be.visible
    expect(container).to.contain.text('This sets up the test data')
  })

  it('does not render steps', () => {
    const background = createBackground({
      name: 'Setup data',
      steps: [
        {
          id: 'step-1',
          keyword: 'Given ',
          text: 'I am logged in',
          location: { line: 2, column: 5 },
        },
      ],
    })
    const { container } = render(<Background background={background} />)
    expect(container).to.not.contain.text('Given')
    expect(container).to.not.contain.text('I am logged in')
  })
})
