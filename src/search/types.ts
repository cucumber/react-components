import { Background, GherkinDocument, Rule, Scenario } from '@cucumber/messages'

import { ScenarioProps } from '../components/customise'

export interface Searchable {
  search: (query: string) => Promise<readonly GherkinDocument[]>
  add: (document: GherkinDocument) => Promise<Searchable>
}

export interface TypedIndex<ReturnedType, SourceType = ReturnedType> {
  search: (query: string) => Promise<Array<ReturnedType>>
  add: (item: SourceType) => Promise<this>
}
