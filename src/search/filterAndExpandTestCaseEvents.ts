import {
  type Pickle,
  TestStepResultStatus as Status,
  type TestCaseFinished,
  type TestCaseStarted,
  type TestStepResultStatus,
} from '@cucumber/messages'
import type { Query as CucumberQuery, Lineage } from '@cucumber/query'
import type { Node as TagExpression } from '@cucumber/tag-expressions'
import { ensure } from '../ensure.js'

export interface ExpandedTestCase<T extends TestCaseStarted | TestCaseFinished> {
  testCaseEvent: T
  pickle: Pickle
  lineage: Lineage
}

export interface FilterCriteria {
  hideStatuses: ReadonlyArray<TestStepResultStatus>
  tagExpression?: TagExpression
}

/**
 * Filters test cases by status and/or tag expression, expanding each survivor with its pickle and
 * lineage.
 *
 * Works for either `TestCaseStarted` or `TestCaseFinished` - the element type flows through to the
 * `testCaseEvent` of each returned item.
 */
export function filterAndExpandTestCaseEvents<T extends TestCaseStarted | TestCaseFinished>(
  cucumberQuery: CucumberQuery,
  testCaseEvents: ReadonlyArray<T>,
  { hideStatuses, tagExpression }: FilterCriteria
): Array<ExpandedTestCase<T>> {
  const expanded: Array<ExpandedTestCase<T>> = []
  for (const testCaseEvent of testCaseEvents) {
    if (hideStatuses.length) {
      const status =
        cucumberQuery.findMostSevereTestStepResultBy(testCaseEvent)?.status ?? Status.UNKNOWN
      if (hideStatuses.includes(status)) {
        continue
      }
    }
    const id = 'id' in testCaseEvent ? testCaseEvent.id : testCaseEvent.testCaseStartedId
    const pickle = ensure(
      cucumberQuery.findPickleBy(testCaseEvent),
      `No Pickle found for TestCase ${id}`
    )
    if (tagExpression) {
      const tags = pickle.tags.map((tag) => tag.name)
      if (!tagExpression.evaluate(tags)) {
        continue
      }
    }
    const lineage = ensure(
      cucumberQuery.findLineageBy(pickle),
      `No Lineage found for Pickle ${pickle.uri}`
    )
    expanded.push({ testCaseEvent, pickle, lineage })
  }
  return expanded
}
