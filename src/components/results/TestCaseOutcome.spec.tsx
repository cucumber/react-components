import { Query } from '@cucumber/query'
import { expect } from 'chai'
import React from 'react'

import hooksSample from '../../../acceptance/hooks/hooks.js'
import hooksConditionalSample from '../../../acceptance/hooks-conditional/hooks-conditional.js'
import { render } from '../../../test-utils/index.js'
import { EnvelopesProvider } from '../app/index.js'
import { TestCaseOutcome } from './TestCaseOutcome.js'

describe('TestCaseOutcome', () => {
  it('should hide successful hooks by default', () => {
    const cucumberQuery = new Query()
    hooksSample.forEach((envelope) => cucumberQuery.update(envelope))
    const [testCaseStarted] = cucumberQuery.findAllTestCaseStarted()

    const { getAllByRole, getByText, queryByText } = render(
      <EnvelopesProvider envelopes={hooksSample}>
        <TestCaseOutcome testCaseStarted={testCaseStarted} />
      </EnvelopesProvider>
    )

    expect(getAllByRole('listitem')).to.have.lengthOf(1)
    expect(queryByText('Before')).not.to.exist
    expect(getByText('a step passes')).to.be.visible
    expect(queryByText('After')).not.to.exist
  })

  it('should always show non-successful hooks', () => {
    const cucumberQuery = new Query()
    hooksConditionalSample.forEach((envelope) => cucumberQuery.update(envelope))
    const [testCaseStarted] = cucumberQuery.findAllTestCaseStarted()

    const { getAllByRole, getByText } = render(
      <EnvelopesProvider envelopes={hooksConditionalSample}>
        <TestCaseOutcome testCaseStarted={testCaseStarted} />
      </EnvelopesProvider>
    )

    expect(getAllByRole('listitem')).to.have.lengthOf(2)
    expect(getByText('Before')).to.be.visible
    expect(getByText('a step passes')).to.be.visible
  })
})
