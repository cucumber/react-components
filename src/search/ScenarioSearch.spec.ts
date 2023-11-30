import * as messages from '@cucumber/messages'

import { makeScenario } from '../../test-utils/index.js'
import ScenarioSearch from './ScenarioSearch.js'

describe('ScenarioSearch', () => {
  let scenarioSearch: ScenarioSearch
  let scenarios: messages.Scenario[]

  beforeEach(() => {
    scenarioSearch = new ScenarioSearch()

    scenarios = [
      makeScenario('a passed scenario', 'a little description', []),
      makeScenario('another passed scenario', 'a long description of the scenario', []),
      makeScenario('a failed scenario', 'description', []),
    ]

    for (const scenario of scenarios) {
      scenarioSearch.add(scenario)
    }
  })

  describe('#search', () => {
    it('returns an empty list when there is no hits', () => {
      const searchResults = scenarioSearch.search('no match there')
      expect(searchResults).toEqual([])
    })

    it('returns scenario which name match the query', () => {
      const searchResults = scenarioSearch.search('failed')
      expect(searchResults).toEqual([scenarios[2]])
    })

    it('may not return results in the original order', () => {
      const searchResults = scenarioSearch.search('scenario')

      for (const scenario of scenarios) {
        expect(searchResults).toContain(scenario)
      }
    })

    it('returns scenario which description match the query', () => {
      const searchResults = scenarioSearch.search('little')
      expect(searchResults).toEqual([scenarios[0]])
    })
  })
})
