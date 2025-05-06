import { Meta } from '@cucumber/messages'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.feature.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { ExecutionSummary } from './ExecutionSummary.js'

const meta: Meta = {
  protocolVersion: '17.1.1',
  implementation: { version: '8.0.0-rc.1', name: 'cucumber-js' },
  cpu: { name: 'x64' },
  os: { name: 'linux', version: '5.11.0-1022-azure' },
  runtime: { name: 'node.js', version: '16.13.1' },
  ci: {
    name: 'GitHub Actions',
    url: 'https://github.com/cucumber/cucumber-js/actions/runs/1592557391',
    buildNumber: '1592557391',
    git: {
      revision: 'b53d820504b31c8e4d44234dc5eaa58d6b7fdd4c',
      remote: 'https://github.com/cucumber/cucumber-js.git',
      branch: 'main',
    },
  },
}

const envelopes = [...examplesTablesFeature, { meta }]

describe('<ExecutionSummary/>', () => {
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

  describe('meta', () => {
    it('should include a phrase for the setup details', () => {
      render(
        <EnvelopesProvider envelopes={envelopes}>
          <ExecutionSummary />
        </EnvelopesProvider>
      )

      expect(screen.getByTestId('setup.phrase')).to.contain.text(
        'cucumber-js@8.0.0-rc.1 with node.js@16.13.1 on linux@5.11.0-1022-azure'
      )
    })

    it('should copy the setup details on request', async () => {
      render(
        <EnvelopesProvider envelopes={envelopes}>
          <ExecutionSummary />
        </EnvelopesProvider>
      )

      await userEvent.click(screen.getByRole('button', { name: 'Copy' }))

      expect(navigator.clipboard.writeText).to.have.been
        .calledOnceWithExactly(`Implementation: cucumber-js@8.0.0-rc.1
Runtime: node.js@16.13.1
Platform: linux@5.11.0-1022-azure`)
    })

    it('should include the pass rate', () => {
      render(
        <EnvelopesProvider envelopes={envelopes}>
          <ExecutionSummary />
        </EnvelopesProvider>
      )

      expect(screen.getByText('55.5% passed')).to.be.visible
    })

    it('should include the job link', () => {
      render(
        <EnvelopesProvider envelopes={envelopes}>
          <ExecutionSummary />
        </EnvelopesProvider>
      )

      expect(screen.getByRole('link', { name: 'GitHub Actions' }))
        .attr('href')
        .to.eq(meta?.ci?.url)
    })

    it('should include the commit link', () => {
      render(
        <EnvelopesProvider envelopes={envelopes}>
          <ExecutionSummary />
        </EnvelopesProvider>
      )

      expect(screen.getByRole('link', { name: 'b53d820' }))
        .attr('href')
        .to.eq(
          'https://github.com/cucumber/cucumber-js/commit/b53d820504b31c8e4d44234dc5eaa58d6b7fdd4c'
        )
    })
  })
})
