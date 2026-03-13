import { create, insert, type Orama, search } from '@orama/orama'

import { ID_SEPARATOR, type TypedIndex } from './types.js'

const schema = {
  name: 'string',
  description: 'string',
} as const

export interface ScenarioLike {
  id: string
  name: string
  description: string
}

/**
 * Can be used for Backgrounds, Scenarios and Rules, searching against the
 * name and description
 */
export class ScenarioLikeSearch<T extends ScenarioLike> implements TypedIndex<T> {
  private readonly index: Orama<typeof schema>

  constructor() {
    this.index = create({
      schema,
      sort: { enabled: false },
    })
  }

  async search(term: string) {
    const { hits } = await search(this.index, {
      term,
    })
    return hits.map((hit) => {
      const [uri, id] = hit.id.split(ID_SEPARATOR)
      return { uri, id }
    })
  }

  async add(item: T, uri: string): Promise<this> {
    await insert(this.index, {
      id: uri + ID_SEPARATOR + item.id,
      name: item.name,
      description: item.description,
    })
    return this
  }
}
