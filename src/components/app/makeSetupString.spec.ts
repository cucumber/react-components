import { expect } from 'chai'

import { makeSetupString } from './makeSetupString.js'

describe('makeSetupString', () => {
  it('returns a multi-line string including impl, runtime and os', () => {
    const result = makeSetupString({
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
    })

    expect(result).to.eq(
      `Implementation: cucumber-js@8.0.0-rc.1
Runtime: node.js@16.13.1
Platform: linux@5.11.0-1022-azure`
    )
  })
})
