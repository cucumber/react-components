import { GherkinDocument } from '@cucumber/messages'

export interface Searchable {
  search: (query: string) => Promise<readonly GherkinDocument[]>
  add: (document: GherkinDocument) => Promise<Searchable>
}

export interface TypedIndex<T> {
  search: (query: string) => Promise<Array<T>>
  add: (item: T) => Promise<this>
}
