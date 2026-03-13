import { generateMessages } from '@cucumber/gherkin'
import { Query as GherkinQuery, pretty } from '@cucumber/gherkin-utils'
import { IdGenerator, SourceMediaType } from '@cucumber/messages'
import { Query as CucumberQuery, type Lineage } from '@cucumber/query'
import { expect } from 'chai'
import { createSearchIndex } from './createSearchIndex.js'
import { deriveLineageConstraints } from './deriveLineageConstraints.js'
import { pruneGherkinDocuments } from './pruneGherkinDocuments.js'

async function searchAndFilter(source: string, searchTerm: string): Promise<string | undefined> {
  const gherkinQuery = new GherkinQuery()
  const cucumberQuery = new CucumberQuery()
  const envelopes = generateMessages(
    source,
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
    cucumberQuery.update(envelope)
  }

  const lineageConstraints = deriveLineageConstraints(
    cucumberQuery.findAllPickles().flatMap((pickle) => {
      const lineage = cucumberQuery.findLineageBy(pickle) as Lineage
      return {
        pickle,
        lineage,
      }
    })
  )

  const gherkinDocuments = gherkinQuery.getGherkinDocuments()
  const searchIndex = await createSearchIndex(gherkinDocuments)
  const searchHits = await searchIndex.search(searchTerm)

  return pruneGherkinDocuments(gherkinDocuments, lineageConstraints, searchHits)
    .map((gherkinDocument) => pretty(gherkinDocument))
    .join('\n\n')
}

describe('search', () => {
  describe('search hits', () => {
    it('returns undefined when nothing matches', async () => {
      const result = await searchAndFilter(
        `Feature: Animals
  Background:
    Given foo

  Rule:
    Background:
      Given bar
    
    Example:
      Given baz
`,
        'xyznonexistent'
      )
      expect(result).to.eq('')
    })

    describe('features', () => {
      it('returns everything when a feature name matches', async () => {
        const result = await searchAndFilter(
          `Feature: Wonderful animals

  Scenario: Cat
    Given a cat

  Scenario: Dog
    Given a dog
`,
          'wonderful'
        )
        expect(result).to.eq(`Feature: Wonderful animals

  Scenario: Cat
    Given a cat

  Scenario: Dog
    Given a dog
`)
      })
    })

    describe('backgrounds', () => {
      it('returns everything under the feature when a background name matches', async () => {
        const result = await searchAndFilter(
          `Feature: Animals

  Background: Habitat setup
    Given a zoo
    And a farm

  Scenario: Cat
    Given a cat

  Scenario: Dog
    Given a dog
`,
          'habitat'
        )
        expect(result).to.eq(`Feature: Animals

  Background: Habitat setup
    Given a zoo
    And a farm

  Scenario: Cat
    Given a cat

  Scenario: Dog
    Given a dog
`)
      })

      it('returns everything under the feature when a background step matches', async () => {
        const result = await searchAndFilter(
          `Feature: Animals

  Background: Setup
    Given a zoo
    And a farm

  Scenario: Cat
    Given a cat

  Scenario: Dog
    Given a dog
`,
          'zoo'
        )
        expect(result).to.eq(`Feature: Animals

  Background: Setup
    Given a zoo
    And a farm

  Scenario: Cat
    Given a cat

  Scenario: Dog
    Given a dog
`)
      })

      it('returns everything under the rule when a rule background name matches', async () => {
        const result = await searchAndFilter(
          `Feature: Animals

  Rule: Domestic animals

    Background: Household setup
      Given a home
      And something else

    Scenario: Cat
      Given a cat

    Scenario: Dog
      Given a dog

  Rule: Wild animals

    Scenario: Lion
      Given a lion
`,
          'household'
        )
        expect(result).to.eq(`Feature: Animals

  Rule: Domestic animals

    Background: Household setup
      Given a home
      And something else

    Scenario: Cat
      Given a cat

    Scenario: Dog
      Given a dog
`)
      })

      it('returns everything under the rule when a rule background step matches', async () => {
        const result = await searchAndFilter(
          `Feature: Animals

  Rule: Domestic animals

    Background: Setup
      Given a home
      And something else

    Scenario: Cat
      Given a cat

    Scenario: Dog
      Given a dog

  Rule: Wild animals

    Scenario: Lion
      Given a lion
`,
          'home'
        )
        expect(result).to.eq(`Feature: Animals

  Rule: Domestic animals

    Background: Setup
      Given a home
      And something else

    Scenario: Cat
      Given a cat

    Scenario: Dog
      Given a dog
`)
      })
    })

    describe('rules', () => {
      it('returns the matching rule and everything under it when a rule name matches', async () => {
        const result = await searchAndFilter(
          `Feature: Animals

  Rule: Domestic animals

    Scenario: Cat
      Given a cat

    Scenario: Dog
      Given a dog

  Rule: Wild animals

    Scenario: Lion
      Given a lion
`,
          'domestic'
        )
        expect(result).to.eq(`Feature: Animals

  Rule: Domestic animals

    Scenario: Cat
      Given a cat

    Scenario: Dog
      Given a dog
`)
      })
    })

    describe('scenarios', () => {
      it('returns only the matching scenario when a scenario name matches', async () => {
        const result = await searchAndFilter(
          `Feature: Animals

  Scenario: Friendly cat
    Given a cat

  Scenario: Angry dog
    Given a dog
`,
          'friendly'
        )
        expect(result).to.eq(`Feature: Animals

  Scenario: Friendly cat
    Given a cat
`)
      })

      it('returns only the matching scenario when a step matches', async () => {
        const result = await searchAndFilter(
          `Feature: Animals

  Scenario: Cat
    Given a cat
    And a bird

  Scenario: Dog
    Given a dog
    And a bird
`,
          'dog'
        )
        expect(result).to.eq(`Feature: Animals

  Scenario: Dog
    Given a dog
    And a bird
`)
      })
    })
  })
})
