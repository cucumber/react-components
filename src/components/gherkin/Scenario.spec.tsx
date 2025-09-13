import * as messages from '@cucumber/messages'
import { Envelope, TestStepResultStatus } from '@cucumber/messages'
import { within } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'

import examplesTables from '../../../acceptance/examples-tables/examples-tables.js'
import minimal from '../../../acceptance/minimal/minimal.js'
import rulesBackgrounds from '../../../acceptance/rules-backgrounds/rules-backgrounds.js'
import { render } from '../../../test-utils/index.js'
import { EnvelopesProvider } from '../app/index.js'
import { Scenario } from './index.js'

describe('Scenario', () => {
  function documentsFrom(envelopes: ReadonlyArray<Envelope>) {
    return envelopes
      .filter((envelope) => envelope.gherkinDocument)
      .map((envelope) => envelope.gherkinDocument)
  }

  function renderScenario(envelopes: ReadonlyArray<Envelope>, scenario: messages.Scenario) {
    return render(
      <EnvelopesProvider envelopes={envelopes}>
        <Scenario scenario={scenario} />
      </EnvelopesProvider>
    )
  }

  function expectTestSteps(
    article: HTMLElement,
    expectedSteps: ReadonlyArray<[TestStepResultStatus, string]>
  ) {
    const actualSteps = within(article).getAllByRole('listitem')
    expect(actualSteps).to.have.length(expectedSteps.length)
    actualSteps.forEach((step, index) => {
      const [expectedStatus, expectedText] = expectedSteps[index]
      expect(step.dataset.status).to.eq(expectedStatus)
      expect(within(step).getByRole('heading', { name: expectedText })).to.be.visible
    })
  }

  it('renders a minimal scenario with steps and statuses', () => {
    const [gherkinDocument] = documentsFrom(minimal)
    const { getByRole } = renderScenario(
      minimal,
      gherkinDocument?.feature?.children[0]?.scenario as messages.Scenario
    )

    expect(getByRole('heading', { name: 'Scenario: cukes' })).to.be.visible
    expectTestSteps(getByRole('article'), [
      [TestStepResultStatus.PASSED, 'Given I have 42 cukes in my belly'],
    ])
  })

  it('includes background steps from feature and rule level', () => {
    const [gherkinDocument] = documentsFrom(rulesBackgrounds)
    const { getByRole } = renderScenario(
      rulesBackgrounds,
      gherkinDocument?.feature?.children[1]?.rule?.children[1].scenario as messages.Scenario
    )

    expect(getByRole('heading', { name: 'Example: one scenario' })).to.be.visible
    expectTestSteps(getByRole('article'), [
      [TestStepResultStatus.PASSED, 'Given an order for "eggs"'],
      [TestStepResultStatus.PASSED, 'And an order for "milk"'],
      [TestStepResultStatus.PASSED, 'And an order for "bread"'],
      [TestStepResultStatus.PASSED, 'Given an order for "batteries"'],
      [TestStepResultStatus.PASSED, 'And an order for "light bulbs"'],
      [TestStepResultStatus.PASSED, 'When an action'],
      [TestStepResultStatus.PASSED, 'Then an outcome'],
    ])
  })

  it('renders each example in a scenario outline individually', () => {
    const [gherkinDocument] = documentsFrom(examplesTables)
    const { getByRole, getAllByRole } = renderScenario(
      examplesTables,
      gherkinDocument?.feature?.children[0]?.scenario as messages.Scenario
    )

    expect(getByRole('heading', { name: 'Scenario Outline: Eating cucumbers' })).to.be.visible
    expect(getByRole('heading', { name: 'Examples: These are passing' })).to.be.visible
    expect(getByRole('heading', { name: 'Examples: These are failing' })).to.be.visible

    const [passing1, passing2, failing1, failing2] = getAllByRole('article')
    expect(within(passing1.parentElement!).getByRole('heading', { name: '#1.1' })).to.be.visible
    expectTestSteps(passing1, [
      [TestStepResultStatus.PASSED, 'Given there are 12 cucumbers'],
      [TestStepResultStatus.PASSED, 'When I eat 5 cucumbers'],
      [TestStepResultStatus.PASSED, 'Then I should have 7 cucumbers'],
    ])
    expect(within(passing2.parentElement!).getByRole('heading', { name: '#1.2' })).to.be.visible
    expectTestSteps(passing2, [
      [TestStepResultStatus.PASSED, 'Given there are 20 cucumbers'],
      [TestStepResultStatus.PASSED, 'When I eat 5 cucumbers'],
      [TestStepResultStatus.PASSED, 'Then I should have 15 cucumbers'],
    ])
    expect(within(failing1.parentElement!).getByRole('heading', { name: '#2.1' })).to.be.visible
    expectTestSteps(failing1, [
      [TestStepResultStatus.PASSED, 'Given there are 12 cucumbers'],
      [TestStepResultStatus.PASSED, 'When I eat 20 cucumbers'],
      [TestStepResultStatus.FAILED, 'Then I should have 0 cucumbers'],
    ])
    expect(within(failing2.parentElement!).getByRole('heading', { name: '#2.2' })).to.be.visible
    expectTestSteps(failing2, [
      [TestStepResultStatus.PASSED, 'Given there are 0 cucumbers'],
      [TestStepResultStatus.PASSED, 'When I eat 1 cucumbers'],
      [TestStepResultStatus.FAILED, 'Then I should have 0 cucumbers'],
    ])
  })
})
