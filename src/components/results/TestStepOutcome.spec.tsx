import type { GherkinDocument } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import { render } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'

import ambiguousSample from '../../../acceptance/ambiguous/ambiguous.js'
import minimalSample from '../../../acceptance/minimal/minimal.js'
import pendingExceptionSample from '../../../acceptance/pending-exception/pending-exception.js'
import skippedExceptionSample from '../../../acceptance/skipped-exception/skipped-exception.js'
import undefinedSample from '../../../acceptance/undefined/undefined.js'
import { EnvelopesProvider } from '../app/index.js'
import { TestStepOutcome } from './TestStepOutcome.js'

describe('TestStepOutcome', () => {
  it('should show ambiguous step definitions with source references for an ambiguous result', () => {
    const cucumberQuery = new CucumberQuery()
    ambiguousSample.forEach((envelope) => cucumberQuery.update(envelope))

    const [testCaseStarted] = cucumberQuery.findAllTestCaseStarted()
    const [[testStepFinished, testStep]] =
      cucumberQuery.findTestStepFinishedAndTestStepBy(testCaseStarted)

    const { getByText } = render(
      <EnvelopesProvider envelopes={ambiguousSample}>
        <TestStepOutcome testStep={testStep} testStepFinished={testStepFinished} />
      </EnvelopesProvider>
    )

    expect(getByText('Multiple matching step definitions found:')).to.be.visible
    expect(getByText('^a (.*?) with (.*?)$')).to.be.visible
    expect(getByText('samples/ambiguous/ambiguous.ts:3')).to.be.visible
    expect(getByText('^a step with (.*?)$')).to.be.visible
    expect(getByText('samples/ambiguous/ambiguous.ts:7')).to.be.visible
  })

  it('should show exception message for a pending result', () => {
    const cucumberQuery = new CucumberQuery()
    pendingExceptionSample.forEach((envelope) => cucumberQuery.update(envelope))

    const [testCaseStarted] = cucumberQuery.findAllTestCaseStarted()
    const [[testStepFinished, testStep]] =
      cucumberQuery.findTestStepFinishedAndTestStepBy(testCaseStarted)

    const { getByText } = render(
      <EnvelopesProvider envelopes={pendingExceptionSample}>
        <TestStepOutcome testStep={testStep} testStepFinished={testStepFinished} />
      </EnvelopesProvider>
    )

    expect(getByText('TODO')).to.be.visible
  })

  it('should show exception message for a skipped result', () => {
    const cucumberQuery = new CucumberQuery()
    skippedExceptionSample.forEach((envelope) => cucumberQuery.update(envelope))

    const [testCaseStarted] = cucumberQuery.findAllTestCaseStarted()
    const [[testStepFinished, testStep]] =
      cucumberQuery.findTestStepFinishedAndTestStepBy(testCaseStarted)

    const { getByText } = render(
      <EnvelopesProvider envelopes={skippedExceptionSample}>
        <TestStepOutcome testStep={testStep} testStepFinished={testStepFinished} />
      </EnvelopesProvider>
    )

    expect(getByText('skipping')).to.be.visible
  })

  it('should show snippets for an undefined result when available', () => {
    const cucumberQuery = new CucumberQuery()
    undefinedSample.forEach((envelope) => cucumberQuery.update(envelope))

    const [testCaseStarted] = cucumberQuery.findAllTestCaseStarted()
    const [[testStepFinished, testStep]] =
      cucumberQuery.findTestStepFinishedAndTestStepBy(testCaseStarted)

    const { container, getByText } = render(
      <EnvelopesProvider envelopes={undefinedSample}>
        <TestStepOutcome testStep={testStep} testStepFinished={testStepFinished} />
      </EnvelopesProvider>
    )

    expect(getByText('No step definition found. Implement with the snippet(s) below:')).to.be
      .visible
    expect(container).to.include.text('Given("a step that is yet to be defined", ()')
  })

  it('should show a brief note for an undefined result when no snippets available', () => {
    const cucumberQuery = new CucumberQuery()
    // omit suggestion messages so there are no snippets
    const envelopes = undefinedSample.filter((envelope) => !envelope.suggestion)
    envelopes.forEach((envelope) => cucumberQuery.update(envelope))

    const [testCaseStarted] = cucumberQuery.findAllTestCaseStarted()
    const [[testStepFinished, testStep]] =
      cucumberQuery.findTestStepFinishedAndTestStepBy(testCaseStarted)

    const { getByText } = render(
      <EnvelopesProvider envelopes={envelopes}>
        <TestStepOutcome testStep={testStep} testStepFinished={testStepFinished} />
      </EnvelopesProvider>
    )

    expect(getByText('No step definition found.')).to.be.visible
  })

  it('should still work when we cant resolve the original step', () => {
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
