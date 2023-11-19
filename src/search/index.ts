import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { GherkinDocument } from '@cucumber/messages'

import Search from './Search'

export interface SearchableDocuments {
  search: (query: string) => readonly GherkinDocument[]
}

export function createSearch(gherkinQuery: GherkinQuery): SearchableDocuments {
  const search = new Search(gherkinQuery)
  gherkinQuery.getGherkinDocuments().forEach((document) => {
    search.add(document)
  })
  return search
}
