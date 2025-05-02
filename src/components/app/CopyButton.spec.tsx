import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'

import { CopyButton } from './CopyButton.js'

describe('<CopyButton/>', () => {
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

  it('should copy text to clipboard, then disable and show checkmark', async () => {
    render(<CopyButton text="test text" />)

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied' })).to.be.visible
      expect(screen.getByRole('button', { name: 'Copied' })).to.have.property('disabled', true)
      expect(navigator.clipboard.writeText).to.have.been.calledOnceWithExactly('test text')
    })
  })
})
