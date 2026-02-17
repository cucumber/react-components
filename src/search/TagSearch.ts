import {
  GherkinDocumentWalker,
  type Query as GherkinQuery,
  rejectAllFilters,
} from '@cucumber/gherkin-utils'
import type { GherkinDocument, Pickle, Scenario } from '@cucumber/messages'
import parse from '@cucumber/tag-expressions'
import { ArrayMultimap } from '@teppeis/multimaps'

import type { Searchable } from './types.js'

class TagSearch {
  private readonly pickleById = new Map<string, Pickle>()
  private readonly picklesByScenarioId = new ArrayMultimap<string, Pickle>()
  private gherkinDocuments: GherkinDocument[] = []

  constructor(private readonly gherkinQuery: GherkinQuery) {
    this.gherkinQuery = gherkinQuery
  }

  public async search(query: string): Promise<readonly GherkinDocument[]> {
    const expressionNode = parse(query)
    const tagFilters = {
      acceptScenario: (scenario: Scenario) => {
        const pickles = this.picklesByScenarioId.get(scenario.id)

        for (const pickle of pickles) {
          const tags = pickle.tags.map((tag) => tag.name)
          if (expressionNode.evaluate(tags)) {
            return true
          }
        }

        return false
      },
    }
    const filters = { ...rejectAllFilters, ...tagFilters }
    const astWalker = new GherkinDocumentWalker(filters)

    return this.gherkinDocuments
      .map((gherkinDocument) => astWalker.walkGherkinDocument(gherkinDocument))
      .filter((gherkinDocument) => gherkinDocument !== null) as GherkinDocument[]
  }

  public async add(gherkinDocument: GherkinDocument) {
    this.gherkinDocuments.push(gherkinDocument)
    const pickles = this.gherkinQuery.getPickles()
    for (const pickle of pickles) {
      this.pickleById.set(pickle.id, pickle)
    }

    const astWalker = new GherkinDocumentWalker(
      {},
      {
        handleScenario: (scenario) => {
          if (!gherkinDocument.uri) throw new Error('No uri for gherkinDocument')
          const pickleIds = this.gherkinQuery.getPickleIds(gherkinDocument.uri, scenario.id)

          for (const pickleId of pickleIds) {
            const pickle = this.pickleById.get(pickleId)
            if (!pickle) {
              throw new Error(`No pickle for id=${pickleId}`)
            }
            this.picklesByScenarioId.put(scenario.id, pickle)
          }
        },
      }
    )
    astWalker.walkGherkinDocument(gherkinDocument)

    return this
  }
}

export async function createTagSearch(gherkinQuery: GherkinQuery): Promise<Searchable> {
  return new TagSearch(gherkinQuery)
}
