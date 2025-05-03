import { TestStepResultStatus } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'

import statuses from './statuses.js'

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
    .map(([key]) => key)
    .sort(statusComparator) as TestStepResultStatus[]

  const totalScenarioCount = [...Object.values(scenarioCountByStatus)].reduce(
    (prev, curr) => prev + curr,
    0
  )

  return { scenarioCountByStatus, statusesWithScenarios, totalScenarioCount }
}

function statusComparator(a: TestStepResultStatus, b: TestStepResultStatus) {
  if (statuses.indexOf(a) < statuses.indexOf(b)) {
    return -1
  }
  if (statuses.indexOf(a) > statuses.indexOf(b)) {
    return 1
  }
  return 0
}
