import { GherkinDocumentWalker } from '@cucumber/gherkin-utils'
import { Background, Feature, GherkinDocument, Rule, Scenario, Step } from '@cucumber/messages'

import { createFeatureSearch } from './FeatureSearch'
import { createScenarioLikeSearch } from './ScenarioLikeSearch'
import { createStepSearch } from './StepSearch'
import { Searchable, TypedIndex } from './types'

class TextSearch {
  private readonly gherkinDocuments: GherkinDocument[] = []

  private readonly stepSearch: TypedIndex<Step>
  private readonly backgroundSearch: TypedIndex<Background>
  private readonly scenarioSearch: TypedIndex<Scenario>
  private readonly ruleSearch: TypedIndex<Rule>
  private readonly featureSearch: TypedIndex<Feature, GherkinDocument>

  constructor(
    stepSearch: TypedIndex<Step>,
    backgroundSearch: TypedIndex<Background>,
    scenarioSearch: TypedIndex<Scenario>,
    ruleSearch: TypedIndex<Rule>,
    featureSearch: TypedIndex<Feature, GherkinDocument>
  ) {
    this.stepSearch = stepSearch
    this.backgroundSearch = backgroundSearch
    this.scenarioSearch = scenarioSearch
    this.ruleSearch = ruleSearch
    this.featureSearch = featureSearch
  }

  public async search(query: string): Promise<readonly GherkinDocument[]> {
    const [matchingSteps, matchingBackgrounds, matchingScenarios, matchingRules, matchingFeatures] =
      await Promise.all([
        this.stepSearch.search(query),
        this.backgroundSearch.search(query),
        this.scenarioSearch.search(query),
        this.ruleSearch.search(query),
        this.featureSearch.search(query),
      ])

    const walker = new GherkinDocumentWalker({
      acceptStep: (step) => matchingSteps.includes(step),
      acceptBackground: (background) => matchingBackgrounds.includes(background),
      acceptScenario: (scenario) => matchingScenarios.includes(scenario),
      acceptRule: (rule) => matchingRules.includes(rule),
      acceptFeature: (feature) => matchingFeatures.includes(feature),
    })

    return this.gherkinDocuments
      .map((gherkinDocument) => walker.walkGherkinDocument(gherkinDocument))
      .filter((gherkinDocument) => !!gherkinDocument) as readonly GherkinDocument[]
  }

  public async add(gherkinDocument: GherkinDocument) {
    this.gherkinDocuments.push(gherkinDocument)
    const promises: Promise<unknown>[] = []
    const walker = new GherkinDocumentWalker(
      {},
      {
        handleStep: (step) => promises.push(this.stepSearch.add(step)),
        handleBackground: (background) => promises.push(this.backgroundSearch.add(background)),
        handleScenario: (scenario) => promises.push(this.scenarioSearch.add(scenario)),
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
  const [stepSearch, backgroundSearch, scenarioSearch, ruleSearch, featureSearch] =
    await Promise.all([
      createStepSearch(),
      createScenarioLikeSearch<Background>(),
      createScenarioLikeSearch<Scenario>(),
      createScenarioLikeSearch<Rule>(),
      createFeatureSearch(),
    ])
  const textSearchImpl = new TextSearch(
    stepSearch,
    backgroundSearch,
    scenarioSearch,
    ruleSearch,
    featureSearch
  )
  for (const document of gherkinDocuments) {
    await textSearchImpl.add(document)
  }
  return textSearchImpl
}
