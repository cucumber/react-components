import { SupportCode } from '@cucumber/fake-cucumber'
import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { Envelope, SourceReference, TestStepResultStatus } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import fs from 'fs'
import path from 'path'

import { runFeature } from '../test-utils'
import countScenariosByStatuses from './countScenariosByStatuses'

const sourceReference: SourceReference = {}

describe('countScenariosByStatuses', () => {
  let gherkinQuery: GherkinQuery
  let cucumberQuery: CucumberQuery
  let supportCode: SupportCode

  jest.setTimeout(3000)

  beforeEach(() => {
    gherkinQuery = new GherkinQuery()
    cucumberQuery = new CucumberQuery()
    supportCode = new SupportCode()
    supportCode.defineStepDefinition(sourceReference, 'a passed step', () => null)
    supportCode.defineStepDefinition(sourceReference, 'a failed step', () => {
      throw new Error('Something bad happened here ...')
    })
  })

  it('counts the number of scenarios with a given status', async () => {
    const feature = `
Feature: statuses

  Scenario: passed
    Given a passed step

  Scenario: another passed
    Given a passed step

  Scenario: failed
    Given a failed step

  Scenario: undefined
    Given we have no clue how to handle this step
    `
    const envelopes = await runFeature(feature, gherkinQuery, supportCode)
    for (const envelope of envelopes) {
      cucumberQuery.update(envelope)
    }

    const { scenarioCountByStatus, statusesWithScenarios, totalScenarioCount } =
      countScenariosByStatuses(gherkinQuery, cucumberQuery)

    expect(scenarioCountByStatus[messages.TestStepResultStatus.PASSED]).toEqual(2)
    expect(scenarioCountByStatus[messages.TestStepResultStatus.FAILED]).toEqual(1)
    expect(scenarioCountByStatus[messages.TestStepResultStatus.UNDEFINED]).toEqual(1)
    expect(statusesWithScenarios).toEqual([
      TestStepResultStatus.FAILED,
      TestStepResultStatus.PASSED,
      TestStepResultStatus.UNDEFINED,
    ])
    expect(totalScenarioCount).toEqual(4)
    // Ridiculously long because runFeature (fake cucumber) seems to run very slowly with ts-node (?)
  })

  it('counts different statuses with example tables', async () => {
    const feature = `
Feature: statuses

  Scenario: with an example table
    Given a <status> step

    Examples:
    | status    |
    | passed    |
    | failed    |
    | undefined |

    `
    const envelopes = await runFeature(feature, gherkinQuery, supportCode)
    for (const envelope of envelopes) {
      cucumberQuery.update(envelope)
    }

    const { scenarioCountByStatus, statusesWithScenarios, totalScenarioCount } =
      countScenariosByStatuses(gherkinQuery, cucumberQuery)

    expect(scenarioCountByStatus[messages.TestStepResultStatus.PASSED]).toEqual(1)
    expect(scenarioCountByStatus[messages.TestStepResultStatus.FAILED]).toEqual(1)
    expect(scenarioCountByStatus[messages.TestStepResultStatus.UNDEFINED]).toEqual(1)
    expect(statusesWithScenarios).toEqual([
      TestStepResultStatus.FAILED,
      TestStepResultStatus.PASSED,
      TestStepResultStatus.UNDEFINED,
    ])
    expect(totalScenarioCount).toEqual(3)
  })

  it('only includes pickles that were slated for execution as test cases', () => {
    const raw = fs.readFileSync(
      path.join(__dirname, '../test-utils/messages/filtered-pickles.ndjson'),
      {
        encoding: 'utf-8',
      }
    )
    const envelopes: Envelope[] = JSON.parse('[' + raw.trim().split('\n').join(',') + ']')
    const gherkinQuery = new GherkinQuery()
    const cucumberQuery = new CucumberQuery()
    envelopes.forEach((envelope) => {
      gherkinQuery.update(envelope)
      cucumberQuery.update(envelope)
    })

    const { totalScenarioCount } = countScenariosByStatuses(gherkinQuery, cucumberQuery)

    expect(totalScenarioCount).toEqual(1)
  })
})
