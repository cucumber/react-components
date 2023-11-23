import { GherkinDocument } from '@cucumber/messages'

export interface Searchable {
  search: (query: string) => Promise<readonly GherkinDocument[]>
  add: (document: GherkinDocument) => Promise<Searchable>
}
