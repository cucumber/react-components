import { Query as CucumberQuery } from '@cucumber/query'
import { expect } from 'chai'
import React from 'react'

import minimalSample from '../../../acceptance/minimal/minimal.js'
import { render } from '../../../test-utils/index.js'
import { EnvelopesProvider } from '../app/index.js'
import { TestStepOutcome } from './TestStepOutcome.js'

describe('TestStepOutcome', () => {
  it('should still work when we cant resolve the original step', () => {
    // omit gherkinDocument messages so we have PickleStep but not Step
    const envelopes = minimalSample.filter((envelope) => !envelope.gherkinDocument)

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

    expect(getByText('I have 42 cukes in my belly')).to.be.visible
  })
})
