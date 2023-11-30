import * as messages from '@cucumber/messages'
import { expect } from 'chai'

import ciCommitLink from './ciCommitLink.js'

describe('ciCommitLink(ci)', () => {
  describe('when executed on GitHubAction', () => {
    it('returns a link to the commit view on GitHub', () => {
      const ci: messages.Ci = {
        name: 'GitHub Actions',
        url: 'http://anywhere',
        git: {
          remote: 'git@github.example.com:company/repo.git',
          revision: 'some-sha',
        },
      }

      expect(ciCommitLink(ci)).to.eq('https://github.example.com/company/repo/commit/some-sha')
    })
  })

  describe('when remote startss with github.com', () => {
    it('returns a link to the commit view on GitHub', () => {
      const ci: messages.Ci = {
        name: 'CircleCI',
        url: 'http://anywhere',
        git: {
          remote: 'https://github.com/company/repo.git',
          revision: 'some-sha',
        },
      }

      expect(ciCommitLink(ci)).to.eq('https://github.com/company/repo/commit/some-sha')
    })
  })

  describe('when git is not specified', () => {
    it('returns undefined', () => {
      const ci: messages.Ci = {
        name: 'SuperCI',
      }

      expect(ciCommitLink(ci)).to.eq(null)
    })
  })
})
