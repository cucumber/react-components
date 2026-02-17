import {
  type DataTable,
  type DocString,
  type Feature,
  IdGenerator,
  type Rule,
  type Scenario,
  type Step,
} from '@cucumber/messages'

function makeFeature(name: string, description: string, scenarios: Scenario[]): Feature {
  return {
    keyword: 'Feature',
    language: 'en',
    location: { line: 1 },
    tags: [],
    name,
    description,
    children: scenarios.map((scenario) => ({
      scenario,
    })),
  }
}

function makeRule(name: string, description: string, scenarios: Scenario[]): Rule {
  const idGenerator = IdGenerator.uuid()

  return {
    id: idGenerator(),
    keyword: 'Rule',
    location: { line: 1 },
    tags: [],
    name,
    description,
    children: scenarios.map((scenario) => ({
      scenario,
    })),
  }
}

function makeScenario(name: string, description: string, steps: Step[]): Scenario {
  const idGenerator = IdGenerator.uuid()

  return {
    id: idGenerator(),
    keyword: 'Scenario',
    location: { line: 1 },
    tags: [],
    examples: [],
    name: name,
    description: description,
    steps: steps,
  }
}

function makeStep(
  keyword: string,
  text: string,
  docstring = '',
  datatable: readonly (readonly string[])[] = []
): Step {
  const idGenerator = IdGenerator.uuid()
  const docString: DocString | undefined = docstring
    ? {
        content: docstring,
        delimiter: '"""',
        location: { line: 1 },
      }
    : undefined
  const dataTable: DataTable | undefined =
    datatable.length > 0
      ? {
          location: { line: 1 },
          rows: datatable.map((row) => ({
            location: { line: 1 },
            id: '123',
            cells: row.map((cell) => ({
              value: cell,
              location: { line: 1 },
            })),
          })),
        }
      : undefined

  return {
    id: idGenerator(),
    location: { line: 1 },
    keyword: keyword,
    text: text,
    docString,
    dataTable,
  }
}

export { makeFeature, makeRule, makeScenario, makeStep }
