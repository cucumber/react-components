import assert from 'node:assert'
import { AstBuilder, GherkinClassicTokenMatcher, Parser } from '@cucumber/gherkin'
import { pretty } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'

import { createTextSearch } from './TextSearch.js'
import type { Searchable } from './types.js'

describe('TextSearch', () => {
  let search: Searchable
  const source = `Feature: Continents

  Background: World
    Given the world exists

  Scenario: Europe
    Given France
    When Spain
    Then The Netherlands

  Scenario: America
    Given Mexico
    Then Brazil

  Scenario: Africa
    Given Ethiopia

  Rule: uninhabited continents

    Scenario: Antartica
      Given some scientific bases
`

  beforeEach(async () => {
    const gherkinDocument = parse(source)

    search = await createTextSearch()
    await search.add(gherkinDocument)
  })

  describe('Hit found in step', () => {
    it('displays just one scenario', async () => {
      const searchResults = await search.search('Spain')

      assert.deepStrictEqual(
        pretty(searchResults[0]),
        `Feature: Continents

  Background: World
    Given the world exists

  Scenario: Europe
    Given France
    When Spain
    Then The Netherlands
`
      )
    })
  })

  describe('Hit found in scenario', () => {
    it('displays just one scenario', async () => {
      const searchResults = await search.search('europe')

      assert.deepStrictEqual(
        pretty(searchResults[0]),
        `Feature: Continents

  Background: World
    Given the world exists

  Scenario: Europe
    Given France
    When Spain
    Then The Netherlands
`
      )
    })
  })

  describe('Hit found in background', () => {
    it('displays all scenarios', async () => {
      const searchResults = await search.search('world')

      assert.deepStrictEqual(pretty(searchResults[0]), source)
    })

    it('finds hits in background steps', async () => {
      const searchResults = await search.search('exists')

      assert.deepStrictEqual(pretty(searchResults[0]), source)
    })
  })

  describe('Hit found in rule', () => {
    it('displays a rule', async () => {
      const searchResults = await search.search('uninhabited')

      assert.deepStrictEqual(
        pretty(searchResults[0]),
        `Feature: Continents

  Background: World
    Given the world exists

  Rule: uninhabited continents

    Scenario: Antartica
      Given some scientific bases
`
      )
    })
  })

  describe('No hit found', () => {
    it('returns no hits', async () => {
      const searchResults = await search.search('saturn')

      assert.deepStrictEqual(searchResults, [])
    })
  })
})

function parse(source: string): messages.GherkinDocument {
  const newId = messages.IdGenerator.uuid()
  const parser = new Parser(new AstBuilder(newId), new GherkinClassicTokenMatcher())
  const gherkinDocument = parser.parse(source)
  gherkinDocument.uri = 'features/acme.feature'
  return gherkinDocument
}
