import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { getWorstTestStepResult, TestStepResultStatus } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'

import { EnvelopesQuery } from './EnvelopesQueryContext'

export const allStatuses = [
  TestStepResultStatus.UNKNOWN,
  TestStepResultStatus.SKIPPED,
  TestStepResultStatus.FAILED,
  TestStepResultStatus.PASSED,
  TestStepResultStatus.AMBIGUOUS,
  TestStepResultStatus.PENDING,
  TestStepResultStatus.UNDEFINED,
] as const

export function makeEmptyScenarioCountsByStatus(): Record<TestStepResultStatus, number> {
  return {
    [TestStepResultStatus.UNKNOWN]: 0,
    [TestStepResultStatus.SKIPPED]: 0,
    [TestStepResultStatus.FAILED]: 0,
    [TestStepResultStatus.PASSED]: 0,
    [TestStepResultStatus.AMBIGUOUS]: 0,
    [TestStepResultStatus.PENDING]: 0,
    [TestStepResultStatus.UNDEFINED]: 0,
  }
}

export default function countScenariosByStatuses(
  gherkinQuery: GherkinQuery,
  cucumberQuery: CucumberQuery,
  envelopesQuery: EnvelopesQuery
): {
  scenarioCountByStatus: Record<TestStepResultStatus, number>
  statusesWithScenarios: readonly TestStepResultStatus[]
  totalScenarioCount: number
} {
  const scenarioCountByStatus = makeEmptyScenarioCountsByStatus()

  gherkinQuery
    .getPickles()
    .filter((pickle) => envelopesQuery.hasTestCase(pickle.id))
    .forEach((pickle) => {
      const status = getWorstTestStepResult(
        cucumberQuery.getPickleTestStepResults([pickle.id])
      ).status
      scenarioCountByStatus[status] = scenarioCountByStatus[status] + 1
    })

  const statusesWithScenarios = Object.entries(scenarioCountByStatus)
    .filter(([, value]) => {
      return value > 0
    })
    .map(([key]) => key) as TestStepResultStatus[]

  const totalScenarioCount = [...Object.values(scenarioCountByStatus)].reduce(
    (prev, curr) => prev + curr,
    0
  )

  return { scenarioCountByStatus, statusesWithScenarios, totalScenarioCount }
}
