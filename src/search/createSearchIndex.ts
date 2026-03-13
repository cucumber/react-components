import type { GherkinDocument } from '@cucumber/messages'

import { TextSearch } from './TextSearch.js'
import type { SearchIndex } from './types.js'

/**
 * Creates a search index that supports querying by term
 */
export async function createSearchIndex(
  gherkinDocuments: ReadonlyArray<GherkinDocument>
): Promise<SearchIndex> {
  const textSearch = new TextSearch()
  await Promise.all(gherkinDocuments.map((gherkinDocument) => textSearch.add(gherkinDocument)))
  return textSearch
}
