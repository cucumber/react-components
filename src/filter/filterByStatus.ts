import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { GherkinDocumentWalker, rejectAllFilters } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { getWorstTestStepResult } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'

import { EnvelopesQuery } from '../EnvelopesQueryContext.js'

export default function filterByStatus(
  gherkinDocument: messages.GherkinDocument,
  gherkinQuery: GherkinQuery,
  cucumberQuery: CucumberQuery,
  envelopesQuery: EnvelopesQuery,
  statuses: readonly messages.TestStepResultStatus[]
): messages.GherkinDocument | null {
  const filters = {
    acceptScenario: (scenario: messages.Scenario) => {
      if (!gherkinDocument.uri) throw new Error('Missing uri for gherkinDocument')
      const pickleIds = gherkinQuery.getPickleIds(gherkinDocument.uri, scenario.id)

      return pickleIds
        .filter((pickleId) => envelopesQuery.hasTestCase(pickleId))
        .some((pickleId) =>
          statuses.includes(
            getWorstTestStepResult(cucumberQuery.getPickleTestStepResults([pickleId])).status
          )
        )
    },
  }

  const walker = new GherkinDocumentWalker({
    ...rejectAllFilters,
    ...filters,
  })

  return walker.walkGherkinDocument(gherkinDocument)
}
