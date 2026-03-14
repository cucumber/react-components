export const ID_SEPARATOR = '\0'

export interface IndexHit {
  uri: string
  id: string
}

/**
 * Facade for an index that supports adding items of a given type and returning hits as an array
 * of uri/id pairs
 */
export interface TypedIndex<SourceType = unknown> {
  search: (query: string) => Promise<ReadonlyArray<IndexHit>>
  add: (item: SourceType, uri: string) => Promise<this>
}

/**
 * Interface for the top-level document search index
 */
export interface SearchIndex {
  search: (query: string) => Promise<SearchHits | false>
}

/**
 * Collection of Gherkin node ids that matched a search term for a single document, grouped by
 * node type
 */
export interface DocumentSearchHits {
  feature: boolean
  background: Array<string>
  rule: Array<string>
  scenario: Array<string>
  step: Array<string>
}

export type SearchHits = ReadonlyMap<string, DocumentSearchHits>

/**
 * Collection of Gherkin node ids harvested from executed test cases, grouped by node type
 * @remarks
 * In the case of `gherkinDocument`, the values are URIs
 */
export interface LineageConstraints {
  gherkinDocument: ReadonlySet<string>
  background: ReadonlySet<string>
  rule: ReadonlySet<string>
  scenario: ReadonlySet<string>
  examples: ReadonlySet<string>
  example: ReadonlySet<string>
}
