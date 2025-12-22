import { GherkinDocument } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import { render } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'

import minimalSample from '../../../acceptance/minimal/minimal.js'
import { EnvelopesProvider } from '../app/index.js'
import { TestStepOutcome } from './TestStepOutcome.js'

describe('TestStepOutcome', () => {
  it('should still work when we cant resolve the original step', () => {
    // omit children from gherkinDocument.feature so that Step is unresolved
    const envelopes = minimalSample.map((envelope) => {
      if (envelope.gherkinDocument) {
        return {
          gherkinDocument: {
            ...envelope.gherkinDocument,
            feature: {
              ...envelope.gherkinDocument.feature,
              children: [],
            },
          } as GherkinDocument,
        }
      }
      return envelope
    })

    const cucumberQuery = new CucumberQuery()
    envelopes.forEach((envelope) => cucumberQuery.update(envelope))

    const [testCaseStarted] = cucumberQuery.findAllTestCaseStarted()
    const [[testStepFinished, testStep]] =
      cucumberQuery.findTestStepFinishedAndTestStepBy(testCaseStarted)

    const { getByText } = render(
      <EnvelopesProvider envelopes={envelopes}>
        <TestStepOutcome testStep={testStep} testStepFinished={testStepFinished} />
      </EnvelopesProvider>
    )

    expect(getByText('cukes in my belly')).to.be.visible
  })
})
