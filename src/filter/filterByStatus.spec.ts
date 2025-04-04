import { SupportCode } from '@cucumber/fake-cucumber'
import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { pretty } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { SourceReference } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import { expect } from 'chai'

import { FailingHook, runFeature } from '../../test-utils/index.js'
import filterByStatus from './filterByStatus.js'

const sourceReference: SourceReference = {}

function scenarioNames(gherkinDocument: messages.GherkinDocument): string[] {
  if (gherkinDocument === null) {
    return []
  }

  return (gherkinDocument.feature?.children || [])
    .filter((child) => child.scenario)
    .map((child) => child.scenario!.name)
}

describe('filterByStatus', () => {
  let gherkinQuery: GherkinQuery
  let cucumberQuery: CucumberQuery
  let supportCode: SupportCode

  const feature = `
Feature: statuses

  Scenario: passed
    Given a passed step

  Scenario: failed
    Given a failed step

  Scenario: undefined
    Given we have no clue how to handle this step
    `

  beforeEach(() => {
    gherkinQuery = new GherkinQuery()
    cucumberQuery = new CucumberQuery()
    supportCode = new SupportCode()
    supportCode.defineStepDefinition(sourceReference, 'a passed step', () => null)
    supportCode.defineStepDefinition(sourceReference, 'a failed step', () => {
      throw new Error('Something bad happened here ...')
    })
  })

  it('only accepts scenarios having one of the expected results', async () => {
    const emitted = await runFeature(feature, gherkinQuery, supportCode)
    const gherkinDocument = emitted.find((envelope) => envelope.gherkinDocument)!.gherkinDocument
    emitted.forEach((message) => {
      cucumberQuery.update(message)
    })

    const passedScenarios = filterByStatus(gherkinDocument!, gherkinQuery, cucumberQuery, [
      messages.TestStepResultStatus.PASSED,
    ])

    expect(scenarioNames(passedScenarios!)).to.deep.eq(['passed'])

    const failedScenarios = filterByStatus(gherkinDocument!, gherkinQuery, cucumberQuery, [
      messages.TestStepResultStatus.FAILED,
    ])
    expect(scenarioNames(failedScenarios!)).to.deep.eq(['failed'])

    const undefinedScenarios = filterByStatus(gherkinDocument!, gherkinQuery, cucumberQuery, [
      messages.TestStepResultStatus.UNDEFINED,
    ])
    expect(scenarioNames(undefinedScenarios!)).to.deep.eq(['undefined'])
  })

  it('can filter with multiple statuses', async () => {
    const emitted = await runFeature(feature, gherkinQuery, supportCode)
    const gherkinDocument = emitted.find((envelope) => envelope.gherkinDocument)!.gherkinDocument
    emitted.forEach((message) => {
      cucumberQuery.update(message)
    })

    const passedAndFailedScenarios = filterByStatus(gherkinDocument!, gherkinQuery, cucumberQuery, [
      messages.TestStepResultStatus.PASSED,
      messages.TestStepResultStatus.FAILED,
    ])
    expect(scenarioNames(passedAndFailedScenarios!)).to.deep.eq(['passed', 'failed'])
  })

  describe('when using examples', () => {
    const featureWithExamples = `Feature: with examples

  Scenario: using examples
    Given a <status> step

    Examples: some statuses
      | status |
      | passed |
      | failed |
`
    it('does not keep scenarios when no result matches', async () => {
      const emitted = await runFeature(featureWithExamples, gherkinQuery, supportCode)
      const gherkinDocument = emitted.find((envelope) => envelope.gherkinDocument)!.gherkinDocument
      emitted.forEach((message) => {
        cucumberQuery.update(message)
      })

      const pendingScenarios = filterByStatus(gherkinDocument!, gherkinQuery, cucumberQuery, [
        messages.TestStepResultStatus.PENDING,
      ])

      expect(scenarioNames(pendingScenarios!)).to.deep.eq([])
    })

    it('does not drop the lines of Example tables with the incorrect status', async () => {
      const emitted = await runFeature(featureWithExamples, gherkinQuery, supportCode)

      const gherkinDocument = emitted.find((envelope) => envelope.gherkinDocument)!.gherkinDocument
      emitted.forEach((message) => {
        cucumberQuery.update(message)
      })

      const onlyPassedScenarios = filterByStatus(gherkinDocument!, gherkinQuery, cucumberQuery, [
        messages.TestStepResultStatus.PASSED,
      ])

      expect(pretty(onlyPassedScenarios!)).to.deep.eq(featureWithExamples)
    })
  })

  describe('when before hook steps fail', () => {
    it('takes those step statuses into account', async () => {
      supportCode.registerBeforeHook(new FailingHook('1234-5678'))

      const emitted = await runFeature(feature, gherkinQuery, supportCode)
      const gherkinDocument = emitted.find((envelope) => envelope.gherkinDocument)!.gherkinDocument
      emitted.forEach((message) => {
        cucumberQuery.update(message)
      })

      const onlyFailedScenarios = filterByStatus(gherkinDocument!, gherkinQuery, cucumberQuery, [
        messages.TestStepResultStatus.FAILED,
      ])

      expect(scenarioNames(onlyFailedScenarios!)).to.deep.eq(['passed', 'failed', 'undefined'])
    })
  })

  describe('when after hook steps fail', () => {
    it('takes those step statuses into account', async () => {
      supportCode.registerAfterHook(new FailingHook('1234-5678'))

      const emitted = await runFeature(feature, gherkinQuery, supportCode)
      const gherkinDocument = emitted.find((envelope) => envelope.gherkinDocument)!.gherkinDocument
      emitted.forEach((message) => {
        cucumberQuery.update(message)
      })

      const onlyFailedScenarios = filterByStatus(gherkinDocument!, gherkinQuery, cucumberQuery, [
        messages.TestStepResultStatus.FAILED,
      ])

      expect(scenarioNames(onlyFailedScenarios!)).to.deep.eq(['passed', 'failed', 'undefined'])
    })
  })
})
