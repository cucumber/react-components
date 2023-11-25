import { GherkinDocument } from '@cucumber/messages'

export interface Searchable {
  search: (query: string) => Promise<readonly GherkinDocument[]>
  add: (document: GherkinDocument) => Promise<Searchable>
}

export interface TypedIndex<ReturnedType, SourceType = ReturnedType> {
  search: (query: string) => Promise<Array<ReturnedType>>
  add: (item: SourceType) => Promise<this>
}
