import { generateMessages } from '@cucumber/gherkin'
import { Query as GherkinQuery, pretty } from '@cucumber/gherkin-utils'
import { IdGenerator, SourceMediaType } from '@cucumber/messages'
import { expect } from 'chai'

import { createTextSearch } from './TextSearch.js'

describe('TextSearch', () => {
  let gherkinQuery: GherkinQuery

  const feature = `Feature: Solar System

  @planet
  Scenario: Earth
    Given is the sixth planet from the Sun

  @dwarf
  Scenario: Pluto
    Given it is not really a planet
`

  beforeEach(() => {
    gherkinQuery = new GherkinQuery()
  })

  async function prettyResults(feature: string, query: string): Promise<string> {
    const envelopes = generateMessages(
      feature,
      'test.feature',
      SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN,
      {
        includeGherkinDocument: true,
        includePickles: true,
        includeSource: true,
        newId: IdGenerator.incrementing(),
      }
    )
    for (const envelope of envelopes) {
      gherkinQuery.update(envelope)
    }
    const search = await createTextSearch(gherkinQuery)
    return pretty((await search.search(query))[0])
  }

  describe('search', () => {
    it('uses TextSearch to filter the results', async () => {
      const results = await prettyResults(feature, 'not really')
      expect(results).to.eq(
        `Feature: Solar System

  @dwarf
  Scenario: Pluto
    Given it is not really a planet
`
      )
    })
  })
})
