import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { GherkinDocument } from '@cucumber/messages'

import Search from './Search'

export interface SearchableDocuments {
  search: (query: string) => Promise<readonly GherkinDocument[]>
}

export async function createSearch(gherkinQuery: GherkinQuery): Promise<SearchableDocuments> {
  const search = new Search(gherkinQuery)
  gherkinQuery.getGherkinDocuments().forEach((document) => {
    search.add(document)
  })
  return search
}
