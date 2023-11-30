import { generateMessages } from '@cucumber/gherkin'
import { pretty, Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'

import { createSearch } from './Search.js'

describe('Search', () => {
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
      messages.SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN,
      {
        includeGherkinDocument: true,
        includePickles: true,
        includeSource: true,
        newId: messages.IdGenerator.incrementing(),
      }
    )
    for (const envelope of envelopes) {
      gherkinQuery.update(envelope)
    }
    const search = await createSearch(gherkinQuery)
    return pretty((await search.search(query))[0])
  }

  describe('search', () => {
    describe('when using a tag expression query', () => {
      it('uses TagSearch to filter the results', async () => {
        const results = await prettyResults(feature, '@planet')
        expect(results).toEqual(
          `Feature: Solar System

  @planet
  Scenario: Earth
    Given is the sixth planet from the Sun
`
        )
      })

      it('does not raises error when tag expression is incorrect', async () => {
        const results = await prettyResults(feature, '(@planet or @dwarf))')
        expect(results).toEqual(
          `Feature: Solar System

  @planet
  Scenario: Earth
    Given is the sixth planet from the Sun

  @dwarf
  Scenario: Pluto
    Given it is not really a planet
`
        )
      })
    })

    describe('when using a query which is not a tag expression', () => {
      it('uses TextSearch to filter the results', async () => {
        const results = await prettyResults(feature, 'not really')
        expect(results).toEqual(
          `Feature: Solar System

  @dwarf
  Scenario: Pluto
    Given it is not really a planet
`
        )
      })
    })
  })
})
