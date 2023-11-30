import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'

import isTagExpression from '../../src/isTagExpression.js'
import TagSearch from '../../src/search/TagSearch.js'
import TextSearch from '../../src/search/TextSearch.js'

export default class Search {
  private readonly tagSearch: TagSearch
  private readonly textSearch = new TextSearch()

  constructor(private readonly gherkinQuery: GherkinQuery) {
    this.tagSearch = new TagSearch(gherkinQuery)
  }

  public search(query: string): messages.GherkinDocument[] {
    if (isTagExpression(query)) {
      try {
        return this.tagSearch.search(query)
      } catch {
        // No-op, we fall back to text search.
      }
    }

    return this.textSearch.search(query)
  }

  public add(gherkinDocument: messages.GherkinDocument) {
    this.tagSearch.add(gherkinDocument)
    this.textSearch.add(gherkinDocument)
  }
}
