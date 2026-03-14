import type { Step } from '@cucumber/messages'
import { create, insert, type Orama, search } from '@orama/orama'

import { ID_SEPARATOR, type TypedIndex } from './types.js'

const schema = {
  keyword: 'string',
  text: 'string',
  docString: 'string',
  dataTable: 'string[]',
} as const

export class StepSearch implements TypedIndex<Step> {
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
      boost: {
        text: 2,
      },
    })
    return hits.map((hit) => {
      const [uri, id] = hit.id.split(ID_SEPARATOR)
      return { uri, id }
    })
  }

  async add(step: Step, uri: string): Promise<this> {
    await insert(this.index, {
      id: uri + ID_SEPARATOR + step.id,
      keyword: step.keyword,
      text: step.text,
      docString: step.docString?.content,
      dataTable: step.dataTable?.rows.flatMap((row) => row.cells).map((cell) => cell.value),
    })
    return this
  }
}
