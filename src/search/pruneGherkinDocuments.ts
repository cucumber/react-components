import type {
  Background,
  Examples,
  Feature,
  FeatureChild,
  GherkinDocument,
  Rule,
  RuleChild,
  Scenario,
  Step,
  TableRow,
} from '@cucumber/messages'
import type { DocumentSearchHits, LineageConstraints, SearchHits } from './types.js'

/**
 * Returns abridged copies of the given documents, with lineage constraints and search hits used
 * to filter out nodes that shouldn't be shown
 *
 * @param gherkinDocuments - the original documents to prune
 * @param constraints - the set of AST node IDs to retain, derived from pickle lineage
 * @param searchHits - if provided, further narrows results to nodes matching a search query.
 *   when `false`, no documents matched the search and an empty array is returned.
 *
 * @remarks
 * The two filtering mechanisms behave a little differently.
 *
 * `lineageConstraints` are strictly enforced at every level - any node of the covered types must
 * have its id included otherwise it will be filtered off. This check is performed eagerly at every
 * level so for e.g. a Rule that isn't matched, we won't even look at its child Scenarios.
 *
 * `searchHits` has cascading behaviour - a match at a higher level (Feature, Rule, or Background)
 * ensures all of its descendants will be retained, and a match at a lower level (Scenario, Step)
 * ensures all of its ascendants (but not siblings) will be retained.
 */
export function pruneGherkinDocuments(
  gherkinDocuments: ReadonlyArray<GherkinDocument>,
  constraints: LineageConstraints,
  searchHits?: SearchHits | false
): ReadonlyArray<GherkinDocument> {
  if (searchHits === false) {
    return []
  }
  const results: GherkinDocument[] = []
  for (const gherkinDocument of gherkinDocuments) {
    if (!gherkinDocument.uri) {
      continue
    }
    if (!constraints.gherkinDocument.has(gherkinDocument.uri)) {
      continue
    }
    const documentHits = searchHits?.get(gherkinDocument.uri)
    if (searchHits && !documentHits) {
      continue
    }
    const pruned = pruneGherkinDocument(gherkinDocument, constraints, documentHits)
    if (pruned) {
      results.push(pruned)
    }
  }
  return results
}

function pruneGherkinDocument(
  gherkinDocument: GherkinDocument,
  constraints: LineageConstraints,
  searchHits?: DocumentSearchHits
): GherkinDocument | undefined {
  if (searchHits?.feature) {
    searchHits = undefined
  }

  const feature = filterFeature(gherkinDocument.feature, constraints, searchHits)
  if (feature) {
    return {
      ...gherkinDocument,
      feature,
    }
  }
}

function filterFeature(
  feature: Feature | undefined,
  constraints: LineageConstraints,
  searchHits?: DocumentSearchHits
): Feature | undefined {
  if (!feature) {
    return undefined
  }

  if (searchHits && matchesOnBackground(feature.children, searchHits)) {
    searchHits = undefined
  }

  const children = feature.children
    .map((child) => filterFeatureChild(child, constraints, searchHits))
    .filter((child) => !!child)

  if (children.some((child) => !child.background)) {
    return {
      ...feature,
      children,
    }
  }
}

function filterFeatureChild(
  child: FeatureChild,
  constraints: LineageConstraints,
  searchHits?: DocumentSearchHits
): FeatureChild | undefined {
  if (child.background) {
    const background = filterBackground(child.background, constraints)
    if (background) {
      return {
        background,
      }
    }
  }
  if (child.scenario) {
    const scenario = filterScenario(child.scenario, constraints, searchHits)
    if (scenario) {
      return {
        scenario,
      }
    }
  }
  if (child.rule) {
    const rule = filterRule(child.rule, constraints, searchHits)
    if (rule) {
      return {
        rule,
      }
    }
  }
  return undefined
}

function filterBackground(background: Background, constraints: LineageConstraints) {
  return constraints.background.has(background.id) ? background : undefined
}

function filterRule(
  rule: Rule,
  constraints: LineageConstraints,
  searchHits?: DocumentSearchHits
): Rule | undefined {
  if (!constraints.rule.has(rule.id)) {
    return undefined
  }

  if (
    searchHits &&
    (searchHits.rule.includes(rule.id) || matchesOnBackground(rule.children, searchHits))
  ) {
    searchHits = undefined
  }

  const children = rule.children
    .map((child) => filterRuleChild(child, constraints, searchHits))
    .filter((child) => !!child)

  if (children.some((child) => !child.background)) {
    return {
      ...rule,
      children,
    }
  }
}

function filterRuleChild(
  child: RuleChild,
  constraints: LineageConstraints,
  searchHits?: DocumentSearchHits
): RuleChild | undefined {
  if (child.background) {
    const background = filterBackground(child.background, constraints)
    if (background) {
      return {
        background,
      }
    }
  }
  if (child.scenario) {
    const scenario = filterScenario(child.scenario, constraints, searchHits)
    if (scenario) {
      return {
        scenario,
      }
    }
  }
  return undefined
}

function filterScenario(
  scenario: Scenario,
  constraints: LineageConstraints,
  searchHits?: DocumentSearchHits
): Scenario | undefined {
  if (!constraints.scenario.has(scenario.id)) {
    return undefined
  }
  if (
    searchHits &&
    !searchHits.scenario.includes(scenario.id) &&
    !matchesOnSteps(scenario.steps, searchHits)
  ) {
    return undefined
  }
  return {
    ...scenario,
    examples: scenario.examples
      .map((examples) => filterExamplesTable(examples, constraints))
      .filter((examples) => !!examples),
  }
}

function filterExamplesTable(
  examples: Examples,
  constraints: LineageConstraints
): Examples | undefined {
  if (!constraints.examples.has(examples.id)) {
    return undefined
  }
  return {
    ...examples,
    tableBody: examples.tableBody
      .map((row) => filterExampleRow(row, constraints))
      .filter((row) => !!row),
  }
}

function filterExampleRow(row: TableRow, constraints: LineageConstraints): TableRow | undefined {
  return constraints.example.has(row.id) ? row : undefined
}

function matchesOnBackground(
  children: ReadonlyArray<RuleChild>,
  searchHits: DocumentSearchHits
): boolean {
  return children
    .map((child) => child.background)
    .filter((background) => !!background)
    .some(
      (background) =>
        searchHits.background.includes(background.id) ||
        matchesOnSteps(background.steps, searchHits)
    )
}

function matchesOnSteps(steps: ReadonlyArray<Step>, searchHits: DocumentSearchHits): boolean {
  return steps.some((step) => searchHits.step.includes(step.id))
}
