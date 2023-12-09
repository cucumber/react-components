import * as messages from '@cucumber/messages'
import { Scenario } from '@cucumber/messages'
import { expect } from 'chai'

import { makeScenario } from '../../test-utils/index.js'
import { createScenarioLikeSearch } from './ScenarioLikeSearch.js'
import { TypedIndex } from './types.js'

describe('ScenarioLikeSearch', () => {
  let scenarioSearch: TypedIndex<Scenario>
  let scenarios: messages.Scenario[]

  beforeEach(async () => {
    scenarioSearch = await createScenarioLikeSearch<Scenario>()

    scenarios = [
      makeScenario('a passed scenario', 'a little description', []),
      makeScenario('another passed scenario', 'a long description of the scenario', []),
      makeScenario('a failed scenario', 'description', []),
    ]

    for (const scenario of scenarios) {
      await scenarioSearch.add(scenario)
    }
  })

  describe('#search', () => {
    it('returns an empty list when there is no hits', async () => {
      const searchResults = await scenarioSearch.search('no match there')
      expect(searchResults).to.deep.eq([])
    })

    it('returns scenario which name match the query', async () => {
      const searchResults = await scenarioSearch.search('failed')
      expect(searchResults).to.deep.eq([scenarios[2]])
    })

    it('may not return results in the original order', async () => {
      const searchResults = await scenarioSearch.search('scenario')

      for (const scenario of scenarios) {
        expect(searchResults).to.contain(scenario)
      }
    })

    it('returns scenario which description match the query', async () => {
      const searchResults = await scenarioSearch.search('little')
      expect(searchResults).to.deep.eq([scenarios[0]])
    })
  })
})
