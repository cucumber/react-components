import type { Step } from '@cucumber/messages'
import { create, insert, type Orama, search } from '@orama/orama'

import type { TypedIndex } from './types.js'

const schema = {
  keyword: 'string',
  text: 'string',
  docString: 'string',
  dataTable: 'string[]',
} as const

export class StepSearch implements TypedIndex<Step> {
  private readonly stepById = new Map<string, Step>()
  private readonly index: Orama<typeof schema>

  constructor() {
    this.index = create({
      schema,
      sort: { enabled: false },
    })
  }

  async search(term: string): Promise<Array<Step>> {
    const { hits } = await search(this.index, {
      term,
      boost: {
        text: 2,
      },
    })
    return hits.map((hit) => this.stepById.get(hit.id)) as Step[]
  }

  async add(step: Step): Promise<this> {
    this.stepById.set(step.id, step)
    await insert(this.index, {
      id: step.id,
      keyword: step.keyword,
      text: step.text,
      docString: step.docString?.content,
      dataTable: step.dataTable?.rows.flatMap((row) => row.cells).map((cell) => cell.value),
    })
    return this
  }
}
