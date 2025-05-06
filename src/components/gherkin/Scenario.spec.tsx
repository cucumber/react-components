import { Envelope, GherkinDocument } from '@cucumber/messages'
import { screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'

import examplesTables from '../../../acceptance/examples-tables/examples-tables.feature.js'
import { render } from '../../../test-utils/index.js'
import UriContext from '../../UriContext.js'
import { EnvelopesProvider } from '../app/EnvelopesProvider.js'
import { Scenario } from './Scenario.js'

describe('<Scenario/>', () => {
  const getStatus = (element: HTMLElement) =>
    within(element).getAllByRole('img', { hidden: true })[0].dataset.status

  describe('with examples', () => {
    const envelopes: Envelope[] = examplesTables as Envelope[]
    const gherkinDocument: GherkinDocument = envelopes.find((env) => env.gherkinDocument)!
      .gherkinDocument as GherkinDocument
    const uri = gherkinDocument.uri!
    const scenario = gherkinDocument.feature!.children[0].scenario!

    beforeEach(() => {
      render(
        <EnvelopesProvider envelopes={envelopes}>
          <UriContext.Provider value={uri}>
            <Scenario scenario={scenario} />
          </UriContext.Provider>
        </EnvelopesProvider>
      )
    })

    it('should render the outline with worst result for each step', () => {
      expect(screen.getByRole('heading', { name: 'Scenario Outline: Eating cucumbers' })).to.be
        .visible
      expect(screen.getByRole('heading', { name: 'Given there are <start> cucumbers' })).to.be
        .visible
      expect(screen.getByRole('heading', { name: 'When I eat <eat> cucumbers' })).to.be.visible
      expect(screen.getByRole('heading', { name: 'Then I should have <left> cucumbers' })).to.be
        .visible
      const [step1, step2, step3] = screen.getAllByRole('listitem')
      expect(getStatus(step1)).to.eq('PASSED')
      expect(getStatus(step2)).to.eq('UNDEFINED')
      expect(getStatus(step3)).to.eq('FAILED')
    })

    it('should render the results for individual examples - all passed', async () => {
      await userEvent.click(within(screen.getAllByRole('table')[0]).getAllByRole('row')[1])

      expect(screen.getByText('@passing')).to.be.visible
      expect(screen.getByRole('heading', { name: 'Example: Eating cucumbers' })).to.be.visible
      expect(screen.getByRole('heading', { name: 'Given there are 12 cucumbers' })).to.be.visible
      expect(screen.getByRole('heading', { name: 'When I eat 5 cucumbers' })).to.be.visible
      expect(screen.getByRole('heading', { name: 'Then I should have 7 cucumbers' })).to.be.visible
      const [step1, step2, step3] = within(
        screen.getByRole('list', { name: 'Steps' })
      ).getAllByRole('listitem')
      expect(getStatus(step1)).to.eq('PASSED')
      expect(getStatus(step2)).to.eq('PASSED')
      expect(getStatus(step3)).to.eq('PASSED')
    })

    it('should render the results for individual examples - one failed', async () => {
      await userEvent.click(within(screen.getAllByRole('table')[1]).getAllByRole('row')[1])

      expect(screen.getByText('@failing')).to.be.visible
      expect(screen.getByRole('heading', { name: 'Example: Eating cucumbers' })).to.be.visible
      expect(screen.getByRole('heading', { name: 'Given there are 12 cucumbers' })).to.be.visible
      expect(screen.getByRole('heading', { name: 'When I eat 20 cucumbers' })).to.be.visible
      expect(screen.getByRole('heading', { name: 'Then I should have 0 cucumbers' })).to.be.visible
      const [step1, step2, step3] = within(
        screen.getByRole('list', { name: 'Steps' })
      ).getAllByRole('listitem')
      expect(getStatus(step1)).to.eq('PASSED')
      expect(getStatus(step2)).to.eq('PASSED')
      expect(getStatus(step3)).to.eq('FAILED')
      expect(screen.getByText(/Expected values to be strictly equal/)).to.be.visible
    })

    it('should render the results for individual examples - undefined', async () => {
      await userEvent.click(within(screen.getAllByRole('table')[2]).getAllByRole('row')[1])

      expect(screen.getByText('@undefined')).to.be.visible
      expect(screen.getByRole('heading', { name: 'Example: Eating cucumbers' })).to.be.visible
      expect(screen.getByRole('heading', { name: 'Given there are 12 cucumbers' })).to.be.visible
      expect(screen.getByRole('heading', { name: 'When I eat banana cucumbers' })).to.be.visible
      expect(screen.getByRole('heading', { name: 'Then I should have 12 cucumbers' })).to.be.visible
      const [step1, step2, step3] = within(
        screen.getByRole('list', { name: 'Steps' })
      ).getAllByRole('listitem')
      expect(getStatus(step1)).to.eq('PASSED')
      expect(getStatus(step2)).to.eq('UNDEFINED')
      expect(getStatus(step3)).to.eq('SKIPPED')
    })

    it('should allow returning to the outline from an example detail', async () => {
      await userEvent.click(within(screen.getAllByRole('table')[0]).getAllByRole('row')[1])
      expect(screen.getByRole('heading', { name: 'Example: Eating cucumbers' })).to.be.visible

      await userEvent.click(
        screen.getByRole('button', { name: 'Back to outline and all 6 examples' })
      )
      expect(screen.getByRole('heading', { name: 'Scenario Outline: Eating cucumbers' })).to.be
        .visible
    })
  })
})
