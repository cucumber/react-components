import type { GherkinDocument } from '@cucumber/messages'

/**
 * Facade for an index that supports searching for and adding items of a given
 * type. Also supports a different type being added vs returned if needed.
 */
export interface TypedIndex<ReturnedType, SourceType = ReturnedType> {
  search: (query: string) => Promise<readonly ReturnedType[]>
  add: (item: SourceType) => Promise<this>
}

/**
 * Interface for the top-level document search index. Accepts an optional set of
 * document URIs to constrain the scope.
 */
export interface SearchIndex {
  search: (query: string, allowedUris?: ReadonlySet<string>) => Promise<readonly GherkinDocument[]>
}
