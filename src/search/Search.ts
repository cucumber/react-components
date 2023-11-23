import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'

import isTagExpression from '../../src/isTagExpression'
import { createTagSearch } from './TagSearch'
import { createTextSearch } from './TextSearch'
import { Searchable } from './types'

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

export async function createSearch(gherkinQuery: GherkinQuery): Promise<Searchable> {
  const [tagSearch, textSearch] = await Promise.all([
    createTagSearch(gherkinQuery),
    createTextSearch(gherkinQuery.getGherkinDocuments()),
  ])
  return new Search(tagSearch, textSearch)
}
