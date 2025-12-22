import { GherkinDocumentWalker, rejectAllFilters } from '@cucumber/gherkin-utils'
import { GherkinDocument, Scenario, TestStepResultStatus } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'

export default function filterByStatus(
  gherkinDocument: GherkinDocument,
  query: CucumberQuery,
  statuses: readonly TestStepResultStatus[]
): GherkinDocument | null {
  const filters = {
    acceptScenario: (scenario: Scenario) => {
      return query
        .findAllTestCaseStarted()
        .filter((started) => query.findLineageBy(started)?.scenario?.id === scenario.id)
        .map((started) => query.findMostSevereTestStepResultBy(started)?.status)
        .some((status) => statuses.includes(status as TestStepResultStatus))
    },
  }

  const walker = new GherkinDocumentWalker({
    ...rejectAllFilters,
    ...filters,
  })

  return walker.walkGherkinDocument(gherkinDocument)
}
