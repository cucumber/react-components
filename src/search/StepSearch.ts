import { Step } from '@cucumber/messages'
import { create, insert, Orama, search } from '@orama/orama'

import { TypedIndex } from './types'

const schema = {
  keyword: 'string',
  text: 'string',
  docString: 'string',
  dataTable: 'string[]',
} as const

class StepSearch implements TypedIndex<Step> {
  private readonly stepById = new Map<string, Step>()
  private readonly index: Orama<typeof schema>

  constructor(index: Orama<typeof schema>) {
    this.index = index
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

export async function createStepSearch() {
  const index: Orama<typeof schema> = await create({
    schema,
    sort: {
      enabled: false,
    },
  })
  return new StepSearch(index)
}
