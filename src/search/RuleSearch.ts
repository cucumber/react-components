import { Rule } from '@cucumber/messages'
import { create, insert, Orama, search } from '@orama/orama'

import { TypedIndex } from './types'

const schema = {
  name: 'string',
  description: 'string',
} as const

class RuleSearch implements TypedIndex<Rule> {
  private ruleById = new Map<string, Rule>()
  private readonly index: Orama<typeof schema>

  constructor(index: Orama<typeof schema>) {
    this.index = index
  }

  async search(term: string): Promise<Array<Rule>> {
    const { hits } = await search(this.index, {
      term,
    })
    return hits.map((hit) => this.ruleById.get(hit.id)) as Rule[]
  }

  async add(rule: Rule): Promise<this> {
    this.ruleById.set(rule.id, rule)
    await insert(this.index, {
      id: rule.id,
      name: rule.name,
      description: rule.description,
    })
    return this
  }
}

export async function createRuleSearch() {
  const index: Orama<typeof schema> = await create({
    schema,
    sort: {
      enabled: false,
    },
  })
  return new RuleSearch(index)
}
