import { Rule } from '@cucumber/messages'

import { makeRule } from '../../test-utils'
import { createRuleSearch } from './RuleSearch'
import { TypedIndex } from './types'

describe('RuleSearch', () => {
  let ruleSearch: TypedIndex<Rule>
  let rules: Rule[]

  beforeEach(async () => {
    ruleSearch = await createRuleSearch()

    rules = [
      makeRule('first rule', 'a little description', []),
      makeRule('second rule', 'a long description', []),
      makeRule('third rule', 'description', []),
    ]

    for (const rule of rules) {
      await ruleSearch.add(rule)
    }
  })

  describe('#search', () => {
    it('returns an empty list when there is no hits', async () => {
      const searchResults = await ruleSearch.search('no match there')
      expect(searchResults).toEqual([])
    })

    it('returns rule which name match the query', async () => {
      const searchResults = await ruleSearch.search('second')
      expect(searchResults).toEqual([rules[1]])
    })

    it('returns rule which name match the query in description', async () => {
      const searchResults = await ruleSearch.search('little')
      expect(searchResults).toEqual([rules[0]])
    })
  })
})
