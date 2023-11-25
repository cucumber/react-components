import * as messages from '@cucumber/messages'
import { Scenario } from '@cucumber/messages'

import { makeScenario } from '../../test-utils'
import { createScenarioLikeSearch } from './ScenarioLikeSearch'
import { TypedIndex } from './types'

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
      expect(searchResults).toEqual([])
    })

    it('returns scenario which name match the query', async () => {
      const searchResults = await scenarioSearch.search('failed')
      expect(searchResults).toEqual([scenarios[2]])
    })

    it('may not return results in the original order', async () => {
      const searchResults = await scenarioSearch.search('scenario')

      for (const scenario of scenarios) {
        expect(searchResults).toContain(scenario)
      }
    })

    it('returns scenario which description match the query', async () => {
      const searchResults = await scenarioSearch.search('little')
      expect(searchResults).toEqual([scenarios[0]])
    })
  })
})
