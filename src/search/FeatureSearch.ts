import type { GherkinDocument } from '@cucumber/messages'
import { create, insert, type Orama, search } from '@orama/orama'

import type { IndexHit, TypedIndex } from './types.js'

const schema = {
  name: 'string',
  description: 'string',
} as const

/**
 * A little different to the other indexes - a Feature doesn't have its own id,
 * so we use the uri of the GherkinDocument as a pointer
 */
export class FeatureSearch implements TypedIndex<GherkinDocument> {
  private readonly index: Orama<typeof schema>

  constructor() {
    this.index = create({
      schema,
      sort: { enabled: false },
    })
  }

  async search(term: string): Promise<ReadonlyArray<IndexHit>> {
    const { hits } = await search(this.index, {
      term,
    })
    return hits.map((hit) => ({ uri: hit.id, id: hit.id }))
  }

  async add(gherkinDocument: GherkinDocument, _uri: string): Promise<this> {
    if (!gherkinDocument.feature) return this
    if (!gherkinDocument.uri) throw new Error('Missing uri on gherkinDocument')
    await insert(this.index, {
      id: gherkinDocument.uri,
      name: gherkinDocument.feature.name,
      description: gherkinDocument.feature.description,
    })
    return this
  }
}
