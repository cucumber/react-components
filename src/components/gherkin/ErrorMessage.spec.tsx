import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'
import sinon from 'sinon'

import { ErrorMessage } from './ErrorMessage.js'

describe('<ErrorMessage/>', () => {
  const originalClipboard = navigator.clipboard

  before(() => {
    // @ts-expect-error overriding navigator.clipboard
    navigator.clipboard = {
      writeText: sinon.stub().resolves(),
    }
  })

  after(() => {
    // @ts-expect-error overriding navigator.clipboard
    navigator.clipboard = originalClipboard
  })

  beforeEach(() => {
    ;(navigator.clipboard.writeText as sinon.SinonStub).resetHistory()
  })

  it('should render the error message with a copy button', () => {
    render(<ErrorMessage message="Something went wrong" />)

    expect(screen.getByText('Something went wrong')).to.be.visible
    expect(screen.getByRole('button', { name: 'Copy' })).to.be.visible
  })

  it('should copy error message when clicking copy button', async () => {
    render(<ErrorMessage message="Something went wrong" />)

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }))

    await waitFor(() => {
      expect(navigator.clipboard.writeText).to.have.been.calledOnceWithExactly(
        'Something went wrong'
      )
    })
  })

  it('should copy children text when message prop is not provided', async () => {
    render(<ErrorMessage>Error from children</ErrorMessage>)

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }))

    await waitFor(() => {
      expect(navigator.clipboard.writeText).to.have.been.calledOnceWithExactly(
        'Error from children'
      )
    })
  })
})
