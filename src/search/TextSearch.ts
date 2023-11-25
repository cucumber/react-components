import { GherkinDocumentWalker } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { Feature, GherkinDocument, Rule, Step } from '@cucumber/messages'

import { createFeatureSearch } from './FeatureSearch'
import { createRuleSearch } from './RuleSearch'
import ScenarioSearch from './ScenarioSearch'
import { createStepSearch } from './StepSearch'
import { Searchable, TypedIndex } from './types'

class TextSearch {
  private readonly gherkinDocuments: messages.GherkinDocument[] = []
  private readonly backgroundSearch = new ScenarioSearch()
  private readonly scenarioSearch = new ScenarioSearch()
  private readonly stepSearch: TypedIndex<Step>
  private readonly ruleSearch: TypedIndex<Rule>
  private readonly featureSearch: TypedIndex<Feature, GherkinDocument>

  constructor(
    stepSearch: TypedIndex<Step>,
    ruleSearch: TypedIndex<Rule>,
    featureSearch: TypedIndex<Feature, GherkinDocument>
  ) {
    this.stepSearch = stepSearch
    this.ruleSearch = ruleSearch
    this.featureSearch = featureSearch
  }

  public async search(query: string): Promise<readonly messages.GherkinDocument[]> {
    const matchingSteps = await this.stepSearch.search(query)
    const matchingBackgrounds = this.backgroundSearch.search(query)
    const matchingScenarios = this.scenarioSearch.search(query)
    const matchingRules = await this.ruleSearch.search(query)
    const matchingFeatures = await this.featureSearch.search(query)

    const walker = new GherkinDocumentWalker({
      acceptStep: (step) => matchingSteps.includes(step),
      acceptScenario: (scenario) => matchingScenarios.includes(scenario),
      // TODO: This is an ugly hack to work around the fact that Scenario and Background are no longer interchangeable,
      // because tags is now mandatory.
      acceptBackground: (background) =>
        matchingBackgrounds.includes(background as messages.Scenario),
      acceptRule: (rule) => matchingRules.includes(rule),
      acceptFeature: (feature) => matchingFeatures.includes(feature),
    })

    return this.gherkinDocuments
      .map((gherkinDocument) => walker.walkGherkinDocument(gherkinDocument))
      .filter((gherkinDocument) => gherkinDocument !== null) as GherkinDocument[]
  }

  public async add(gherkinDocument: messages.GherkinDocument) {
    this.gherkinDocuments.push(gherkinDocument)
    const promises: Promise<unknown>[] = []
    const walker = new GherkinDocumentWalker(
      {},
      {
        handleStep: (step) => promises.push(this.stepSearch.add(step)),
        handleScenario: (scenario) => this.scenarioSearch.add(scenario),
        handleBackground: (background) =>
          this.backgroundSearch.add(background as messages.Scenario),
        handleRule: (rule) => promises.push(this.ruleSearch.add(rule)),
      }
    )
    promises.push(this.featureSearch.add(gherkinDocument))
    walker.walkGherkinDocument(gherkinDocument)
    await Promise.all(promises)
    return this
  }
}

export async function createTextSearch(
  gherkinDocuments: readonly GherkinDocument[]
): Promise<Searchable> {
  const [stepSearch, ruleSearch, featureSearch] = await Promise.all([
    createStepSearch(),
    createRuleSearch(),
    createFeatureSearch(),
  ])
  const textSearchImpl = new TextSearch(stepSearch, ruleSearch, featureSearch)
  for (const document of gherkinDocuments) {
    await textSearchImpl.add(document)
  }
  return textSearchImpl
}
