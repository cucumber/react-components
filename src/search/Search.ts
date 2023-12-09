import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'

import isTagExpression from '../isTagExpression.js'
import { createTagSearch } from './TagSearch.js'
import { createTextSearch } from './TextSearch.js'
import { Searchable } from './types.js'

class Search {
  constructor(private readonly tagSearch: Searchable, private readonly textSearch: Searchable) {}

  public async search(query: string): Promise<readonly messages.GherkinDocument[]> {
    if (isTagExpression(query)) {
      try {
        return await this.tagSearch.search(query)
      } catch {
        // No-op, we fall back to text search.
      }
    }

    return this.textSearch.search(query)
  }

  public async add(gherkinDocument: messages.GherkinDocument) {
    await this.tagSearch.add(gherkinDocument)
    await this.textSearch.add(gherkinDocument)
    return this
  }
}

/**
 * Creates a search index that supports querying by term or tag expression, and
 * returns an array of abridged Gherkin documents matching the query.
 *
 * @param gherkinQuery - query instance used internally for searching, with any
 * documents already present being pre-populated in the search index
 */
export async function createSearch(gherkinQuery: GherkinQuery): Promise<Searchable> {
  const [tagSearch, textSearch] = await Promise.all([
    createTagSearch(gherkinQuery),
    createTextSearch(),
  ])
  const searchImpl = new Search(tagSearch, textSearch)
  for (const doc of gherkinQuery.getGherkinDocuments()) {
    await searchImpl.add(doc)
  }
  return searchImpl
}
