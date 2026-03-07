import type { Background, GherkinDocument, Rule, Scenario } from '@cucumber/messages'

import { FeatureSearch } from './FeatureSearch.js'
import { ScenarioLikeSearch } from './ScenarioLikeSearch.js'
import { StepSearch } from './StepSearch.js'
import { TextSearch } from './TextSearch.js'
import type { SearchIndex } from './types.js'

/**
 * Creates a search index that supports querying by term, and returns an array
 * of abridged Gherkin documents matching the query.
 */
export async function createSearchIndex(
  gherkinDocuments: ReadonlyArray<GherkinDocument>
): Promise<SearchIndex> {
  const textSearch = new TextSearch(
    new StepSearch(),
    new ScenarioLikeSearch<Background>(),
    new ScenarioLikeSearch<Scenario>(),
    new ScenarioLikeSearch<Rule>(),
    new FeatureSearch()
  )
  for (const doc of gherkinDocuments) {
    await textSearch.add(doc)
  }
  return textSearch
}
