import type { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import type { GherkinDocument } from '@cucumber/messages'

import { createTextSearch } from './TextSearch.js'
import type { Searchable } from './types.js'

class Search {
  private readonly documents: GherkinDocument[] = []

  constructor(private readonly textSearch: Searchable) {}

  public async search(query: string): Promise<readonly GherkinDocument[]> {
    if (!query) {
      return [...this.documents]
    }

    return this.textSearch.search(query)
  }

  public async add(gherkinDocument: GherkinDocument) {
    this.documents.push(gherkinDocument)
    await this.textSearch.add(gherkinDocument)
    return this
  }
}

/**
 * Creates a search index that supports querying by term, and returns an array
 * of abridged Gherkin documents matching the query.
 *
 * @param gherkinQuery - query instance used internally for searching, with any
 * documents already present being pre-populated in the search index
 */
export async function createSearch(gherkinQuery: GherkinQuery): Promise<Searchable> {
  const textSearch = await createTextSearch()
  const searchImpl = new Search(textSearch)
  for (const doc of gherkinQuery.getGherkinDocuments()) {
    await searchImpl.add(doc)
  }
  return searchImpl
}
