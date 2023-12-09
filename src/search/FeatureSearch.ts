import { Feature, GherkinDocument } from '@cucumber/messages'
import { create, insert, Orama, search } from '@orama/orama'

import { TypedIndex } from './types.js'

const schema = {
  name: 'string',
  description: 'string',
} as const

/**
 * A little different than the other indexes - a Feature doesn't have its own id,
 * so we use the uri of the GherkinDocument as a pointer
 */
class FeatureSearch implements TypedIndex<Feature, GherkinDocument> {
  private readonly featuresByUri = new Map<string, Feature>()
  private readonly index: Orama<typeof schema>

  constructor(index: Orama<typeof schema>) {
    this.index = index
  }

  async search(term: string): Promise<Array<Feature>> {
    const { hits } = await search(this.index, {
      term,
    })
    return hits.map((hit) => this.featuresByUri.get(hit.id)) as Feature[]
  }

  async add(gherkinDocument: GherkinDocument): Promise<this> {
    if (!gherkinDocument.feature) return this
    if (!gherkinDocument.uri) throw new Error('Missing uri on gherkinDocument')
    this.featuresByUri.set(gherkinDocument.uri, gherkinDocument.feature)
    await insert(this.index, {
      id: gherkinDocument.uri,
      name: gherkinDocument.feature.name,
      description: gherkinDocument.feature.description,
    })
    return this
  }
}

export async function createFeatureSearch(): Promise<TypedIndex<Feature, GherkinDocument>> {
  const index: Orama<typeof schema> = await create({
    schema,
    sort: {
      enabled: false,
    },
  })
  return new FeatureSearch(index)
}
