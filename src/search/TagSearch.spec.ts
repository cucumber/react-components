import { generateMessages } from '@cucumber/gherkin'
import { pretty, Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { expect } from 'chai'

import { createTagSearch } from './TagSearch.js'

describe('TagSearch', () => {
  let gherkinQuery: GherkinQuery

  const feature = `@system
Feature: Solar System

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
        includePickles: true,
        includeGherkinDocument: true,
        newId: messages.IdGenerator.incrementing(),
      }
    )
    const tagSearch = await createTagSearch(gherkinQuery)
    for (const envelope of envelopes) {
      gherkinQuery.update(envelope)
    }
    for (const document of gherkinQuery.getGherkinDocuments()) {
      await tagSearch.add(document)
    }
    return pretty((await tagSearch.search(query))[0])
  }

  describe('search', () => {
    it('returns an empty list when no documents have been added', async () => {
      const tagSearch = await createTagSearch(gherkinQuery)
      expect(await tagSearch.search('@any')).to.deep.eq([])
    })

    it('finds matching scenarios', async () => {
      expect(await prettyResults(feature, '@planet')).to.contain('Scenario: Earth')
    })

    it('takes into account feature tags', async () => {
      const results = await prettyResults(feature, '@system')

      expect(results).to.contain('Scenario: Earth')
      expect(results).to.contain('Scenario: Pluto')
    })

    it('supports complex search', async () => {
      const results = await prettyResults(feature, '@system and not @dwarf')

      expect(results).to.contain('Scenario: Earth')
      expect(results).not.to.contain('Scenario: Pluto')
    })
  })

  describe('with examples and tags', () => {
    // Currently, we are filtering at the scenario level,
    // so as long as one example match, we keep them all.

    const exampleFeature = `@system
Feature: Solar system

  Scenario: a planet may have sattelites
    Then <satellites> should arround <planet>

    @solid
    Examples: solid planets
      | planet | satellites     |
      | earth  | moon           |
      | mars   | phobos, demios |

    @gas
    Examples: giant gas planets
      | jupiter | Io, Europe, Ganymède, Callisto |
`
    it('does not filter non-matching examples', async () => {
      const results = await prettyResults(exampleFeature, '@solid')

      expect(results).to.contain('Scenario: a planet may have sattelites')
      expect(results).to.contain('Examples: solid planets')
      expect(results).to.contain('Examples: giant gas planets')
    })

    it('does not filter examples which should be excluded', async () => {
      const results = await prettyResults(exampleFeature, '@solid and not @gas')

      expect(results).to.contain('Scenario: a planet may have sattelites')
      expect(results).to.contain('Examples: solid planets')
      expect(results).to.contain('Examples: giant gas planets')
    })
  })
})
