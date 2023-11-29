import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import * as messages from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import React from 'react'

import { render } from '../../../test-utils/index.js'
import { GherkinStep } from './GherkinStep.js'

describe('<GherkinStep>', () => {
  it('renders', () => {
    const step: messages.Step = {
      keyword: 'Given',
      text: 'the 48 pixies',
      location: { column: 1, line: 1 },
      id: '123',
    }

    class StubCucumberQuery extends CucumberQuery {
      public getStepMatchArgumentsLists(): messages.StepMatchArgumentsList[] {
        return [
          {
            stepMatchArguments: [
              {
                group: {
                  start: 4,
                  value: '48',
                  children: [],
                },
              },
            ],
          },
        ]
      }
    }

    class StubGherkinQuery extends GherkinQuery {
      getPickleStepIds(): string[] {
        return ['dummy-id']
      }
    }

    const { asFragment } = render(<GherkinStep step={step} hasExamples={false} />, {
      gherkinQuery: new StubGherkinQuery(),
      cucumberQuery: new StubCucumberQuery(),
    })

    expect(asFragment()).toMatchSnapshot()
  })
})
