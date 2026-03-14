import { walkGherkinDocument } from '@cucumber/gherkin-utils'
import type { Background, GherkinDocument, Rule, Scenario } from '@cucumber/messages'
import { FeatureSearch } from './FeatureSearch.js'
import { ScenarioLikeSearch } from './ScenarioLikeSearch.js'
import { StepSearch } from './StepSearch.js'
import type { DocumentSearchHits, IndexHit, SearchHits, SearchIndex } from './types.js'

export class TextSearch implements SearchIndex {
  private readonly featureSearch = new FeatureSearch()
  private readonly backgroundSearch = new ScenarioLikeSearch<Background>()
  private readonly ruleSearch = new ScenarioLikeSearch<Rule>()
  private readonly scenarioSearch = new ScenarioLikeSearch<Scenario>()
  private readonly stepSearch = new StepSearch()

  public async search(query: string): Promise<SearchHits | false> {
    const [featureHits, backgroundHits, ruleHits, scenarioHits, stepHits] = await Promise.all([
      this.featureSearch.search(query),
      this.backgroundSearch.search(query),
      this.ruleSearch.search(query),
      this.scenarioSearch.search(query),
      this.stepSearch.search(query),
    ])
    const allHits: ReadonlyArray<IndexHit> = [
      ...featureHits,
      ...backgroundHits,
      ...ruleHits,
      ...scenarioHits,
      ...stepHits,
    ]
    if (allHits.length === 0) {
      return false
    }
    const map = new Map<string, DocumentSearchHits>()
    const getOrDefault = (uri: string) => {
      let entry = map.get(uri)
      if (!entry) {
        entry = { feature: false, background: [], rule: [], scenario: [], step: [] }
        map.set(uri, entry)
      }
      return entry
    }
    for (const hit of featureHits) {
      getOrDefault(hit.uri).feature = true
    }
    for (const hit of backgroundHits) {
      getOrDefault(hit.uri).background.push(hit.id)
    }
    for (const hit of ruleHits) {
      getOrDefault(hit.uri).rule.push(hit.id)
    }
    for (const hit of scenarioHits) {
      getOrDefault(hit.uri).scenario.push(hit.id)
    }
    for (const hit of stepHits) {
      getOrDefault(hit.uri).step.push(hit.id)
    }
    return map
  }

  public async add(gherkinDocument: GherkinDocument) {
    const uri = gherkinDocument.uri
    if (!uri) {
      return
    }
    const promises = walkGherkinDocument<Array<Promise<unknown>>>(gherkinDocument, [], {
      feature: (_feature, acc) => [...acc, this.featureSearch.add(gherkinDocument, uri)],
      background: (background, acc) => [...acc, this.backgroundSearch.add(background, uri)],
      rule: (rule, acc) => [...acc, this.ruleSearch.add(rule, uri)],
      scenario: (scenario, acc) => [...acc, this.scenarioSearch.add(scenario, uri)],
      step: (step, acc) => [...acc, this.stepSearch.add(step, uri)],
    })
    await Promise.all(promises)
  }
}
