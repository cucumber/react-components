import { Meta } from '@cucumber/messages'
import { render } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.feature.js'
import { EnvelopesWrapper } from './EnvelopesWrapper.js'
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

describe('ExecutionSummary', () => {
  const envelopes = [...examplesTablesFeature, { meta }]

  describe('meta', () => {
    it('should include the implementation name and version', () => {
      const { getByText } = render(
        <EnvelopesWrapper envelopes={envelopes}>
          <ExecutionSummary />
        </EnvelopesWrapper>
      )

      expect(getByText('cucumber-js 8.0.0-rc.1')).to.be.visible
    })

    it('should include the job link', () => {
      const { getByText } = render(
        <EnvelopesWrapper envelopes={envelopes}>
          <ExecutionSummary />
        </EnvelopesWrapper>
      )

      const jobLinkElement = getByText(meta?.ci?.buildNumber as string)
      expect(jobLinkElement).to.be.visible
      expect(jobLinkElement.getAttribute('href')).to.eq(meta?.ci?.url)
    })
  })
})
