import { create, insert, Orama, search } from '@orama/orama'

import { TypedIndex } from './types'

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
class ScenarioLikeSearch<T extends ScenarioLike> implements TypedIndex<T> {
  private itemById = new Map<string, T>()
  private readonly index: Orama<typeof schema>

  constructor(index: Orama<typeof schema>) {
    this.index = index
  }

  async search(term: string): Promise<Array<T>> {
    const { hits } = await search(this.index, {
      term,
    })
    return hits.map((hit) => this.itemById.get(hit.id)) as T[]
  }

  async add(item: T): Promise<this> {
    this.itemById.set(item.id, item)
    await insert(this.index, {
      id: item.id,
      name: item.name,
      description: item.description,
    })
    return this
  }
}

export async function createScenarioLikeSearch<T extends ScenarioLike>(): Promise<
  ScenarioLikeSearch<T>
> {
  const index: Orama<typeof schema> = await create({
    schema,
    sort: {
      enabled: false,
    },
  })
  return new ScenarioLikeSearch<T>(index)
}
