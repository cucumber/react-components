import { TestStepResultStatus } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'

export const allStatuses = [
  TestStepResultStatus.UNKNOWN,
  TestStepResultStatus.SKIPPED,
  TestStepResultStatus.FAILED,
  TestStepResultStatus.PASSED,
  TestStepResultStatus.AMBIGUOUS,
  TestStepResultStatus.PENDING,
  TestStepResultStatus.UNDEFINED,
] as const

export default function countScenariosByStatuses(cucumberQuery: CucumberQuery): {
  scenarioCountByStatus: Record<TestStepResultStatus, number>
  statusesWithScenarios: readonly TestStepResultStatus[]
  totalScenarioCount: number
} {
  const scenarioCountByStatus = cucumberQuery.countMostSevereTestStepResultStatus()

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
