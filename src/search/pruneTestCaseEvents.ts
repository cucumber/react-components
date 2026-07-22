import type { TestCaseFinished, TestCaseStarted } from '@cucumber/messages'
import type { ExpandedTestCase } from './filterAndExpandTestCases.js'
import type { SearchHits } from './types.js'

/**
 * Narrows expanded test cases down to those that overlap with the given search hits.
 *
 * @param expandedTestCases - the test cases to narrow, each paired with its pickle and lineage
 * @param searchHits - the hits to narrow against; an empty map means the search matched nothing
 *
 * @remarks
 * A test case is retained when its lineage overlaps a hit at any level: a matched Feature retains
 * every test case beneath it; otherwise the test case's own Rule, Background, or Scenario must be
 * hit, or one of its steps must be hit. An empty map means there were no hits at all, so nothing
 * is retained.
 */
export function pruneTestCaseEvents<T extends TestCaseStarted | TestCaseFinished>(
  expandedTestCases: ReadonlyArray<ExpandedTestCase<T>>,
  searchHits: SearchHits
): ReadonlyArray<ExpandedTestCase<T>> {
  if (searchHits.size === 0) {
    return []
  }
  return expandedTestCases.filter(({ lineage, pickle }) => {
    const documentHits = searchHits.get(pickle.uri)
    if (!documentHits) {
      return false
    }
    if (documentHits.feature) {
      return true
    }
    if (lineage.background && documentHits.background.has(lineage.background.id)) {
      return true
    }
    if (lineage.rule && documentHits.rule.has(lineage.rule.id)) {
      return true
    }
    if (lineage.ruleBackground && documentHits.background.has(lineage.ruleBackground.id)) {
      return true
    }
    if (lineage.scenario && documentHits.scenario.has(lineage.scenario.id)) {
      return true
    }
    const stepNodeIds = new Set(pickle.steps.flatMap((step) => step.astNodeIds))
    return !stepNodeIds.isDisjointFrom(documentHits.step)
  })
}
