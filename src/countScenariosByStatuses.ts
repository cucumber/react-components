import { GherkinDocumentWalker, Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { getWorstTestStepResult, TestStepResultStatus } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'

import { EnvelopesQuery } from './EnvelopesQueryContext.js'

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

  for (const gherkinDocument of gherkinQuery.getGherkinDocuments()) {
    const counter = new GherkinDocumentWalker(
      {},
      {
        handleScenario: (scenario) => {
          if (!gherkinDocument.uri) throw new Error('Missing uri on gherkinDocument')
          const pickleIds = gherkinQuery.getPickleIds(gherkinDocument.uri, scenario.id)

          pickleIds.forEach((pickleId) => {
            // if no test case then this pickle was omitted by filtering e.g. tags
            if (envelopesQuery.hasTestCase(pickleId)) {
              const status = getWorstTestStepResult(
                cucumberQuery.getPickleTestStepResults([pickleId])
              ).status
              scenarioCountByStatus[status] = scenarioCountByStatus[status] + 1
            }
          })
        },
      }
    )
    counter.walkGherkinDocument(gherkinDocument)
  }

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
