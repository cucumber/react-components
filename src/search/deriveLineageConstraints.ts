import type { Pickle } from '@cucumber/messages'
import type { Lineage } from '@cucumber/query'
import type { LineageConstraints } from './types.js'

export function deriveLineageConstraints(
  items: ReadonlyArray<{ pickle: Pickle; lineage: Lineage }>
): LineageConstraints {
  const gherkinDocument = new Set<string>()
  const background = new Set<string>()
  const rule = new Set<string>()
  const scenario = new Set<string>()
  const examples = new Set<string>()
  const example = new Set<string>()
  for (const { pickle, lineage } of items) {
    gherkinDocument.add(pickle.uri)
    if (lineage.background) {
      background.add(lineage.background.id)
    }
    if (lineage.ruleBackground) {
      background.add(lineage.ruleBackground.id)
    }
    if (lineage.rule) {
      rule.add(lineage.rule.id)
    }
    if (lineage.scenario) {
      scenario.add(lineage.scenario.id)
    }
    if (lineage.examples) {
      examples.add(lineage.examples.id)
    }
    if (lineage.example) {
      example.add(lineage.example.id)
    }
  }
  return {
    gherkinDocument,
    background,
    rule,
    scenario,
    examples,
    example,
  }
}
