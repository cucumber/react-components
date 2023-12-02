import { generateMessages } from '@cucumber/gherkin'
import { pretty, Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { expect } from 'chai'

import Search from './Search.js'

describe('Search', () => {
  let search: Search
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
    search = new Search(gherkinQuery)
  })

  function prettyResults(feature: string, query: string): string {
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
    for (const envelope of envelopes) {
      if (envelope.gherkinDocument) {
        search.add(envelope.gherkinDocument)
      }
    }
    return pretty(search.search(query)[0])
  }

  describe('search', () => {
    describe('when using a tag expression query', () => {
      it('uses TagSearch to filter the results', () => {
        const results = prettyResults(feature, '@planet')
        expect(results).to.eq(
          `Feature: Solar System

  @planet
  Scenario: Earth
    Given is the sixth planet from the Sun
`
        )
      })

      it('does not raises error when tag expression is incorrect', () => {
        const results = prettyResults(feature, '(@planet or @dwarf))')
        expect(results).to.eq(
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
      it('uses TextSearch to filter the results', () => {
        const results = prettyResults(feature, 'not really (')
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
})
