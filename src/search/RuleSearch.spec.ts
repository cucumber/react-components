import * as messages from '@cucumber/messages'

import { makeRule } from '../../test-utils/index.js'
import RuleSearch from './RuleSearch.js'

describe('RuleSearch', () => {
  let ruleSearch: RuleSearch
  let rules: messages.Rule[]

  beforeEach(() => {
    ruleSearch = new RuleSearch()

    rules = [
      makeRule('first rule', 'a little description', []),
      makeRule('second rule', 'a long description', []),
      makeRule('third rule', 'description', []),
    ]

    for (const rule of rules) {
      ruleSearch.add(rule)
    }
  })

  describe('#search', () => {
    it('returns an empty list when there is no hits', () => {
      const searchResults = ruleSearch.search('no match there')
      expect(searchResults).toEqual([])
    })

    it('returns rule which name match the query', () => {
      const searchResults = ruleSearch.search('second')
      expect(searchResults).toEqual([rules[1]])
    })

    it('returns rule which name match the query in description', () => {
      const searchResults = ruleSearch.search('little')
      expect(searchResults).toEqual([rules[0]])
    })
  })
})
