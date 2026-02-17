import type { GherkinDocument } from '@cucumber/messages'

/**
 * Facade for an index that supports searching for and adding items of a given
 * type. Also supports a different type being added if needed.
 */
export interface TypedIndex<ReturnedType, SourceType = ReturnedType> {
  search: (query: string) => Promise<readonly ReturnedType[]>
  add: (item: SourceType) => Promise<this>
}

/**
 * Shorthand type for an index of Gherkin documents.
 */
export type Searchable = TypedIndex<GherkinDocument>
