import { Envelope, GherkinDocument } from '@cucumber/messages'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import examplesTables from '../../../acceptance/examples-tables/examples-tables.feature'
import { render } from '../../../test-utils'
import UriContext from '../../UriContext'
import { EnvelopesWrapper } from '../app/EnvelopesWrapper'
import { Scenario } from './Scenario'

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
        <EnvelopesWrapper envelopes={envelopes}>
          <UriContext.Provider value={uri}>
            <Scenario scenario={scenario} />
          </UriContext.Provider>
        </EnvelopesWrapper>
      )
    })

    it('should render the outline with worst result for each step', () => {
      expect(
        screen.getByRole('heading', { name: 'Scenario Outline: eating cucumbers' })
      ).toBeVisible()
      expect(
        screen.getByRole('heading', { name: 'Given there are <start> cucumbers' })
      ).toBeVisible()
      expect(screen.getByRole('heading', { name: 'When I eat <eat> cucumbers' })).toBeVisible()
      expect(
        screen.getByRole('heading', { name: 'Then I should have <left> cucumbers' })
      ).toBeVisible()
      const [step1, step2, step3] = screen.getAllByRole('listitem')
      expect(getStatus(step1)).toEqual('PASSED')
      expect(getStatus(step2)).toEqual('UNDEFINED')
      expect(getStatus(step3)).toEqual('FAILED')
    })

    it('should render the results for individual examples - all passed', () => {
      userEvent.click(screen.getAllByRole('button', { name: 'Detail' })[0])

      expect(screen.getByText('@passing')).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Example: eating cucumbers' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Given there are 12 cucumbers' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'When I eat 5 cucumbers' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Then I should have 7 cucumbers' })).toBeVisible()
      const [step1, step2, step3] = within(
        screen.getByRole('list', { name: 'Steps' })
      ).getAllByRole('listitem')
      expect(getStatus(step1)).toEqual('PASSED')
      expect(getStatus(step2)).toEqual('PASSED')
      expect(getStatus(step3)).toEqual('PASSED')
    })

    it('should render the results for individual examples - one failed', () => {
      userEvent.click(screen.getAllByRole('button', { name: 'Detail' })[2])

      expect(screen.getByText('@failing')).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Example: eating cucumbers' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Given there are 12 cucumbers' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'When I eat 20 cucumbers' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Then I should have 0 cucumbers' })).toBeVisible()
      const [step1, step2, step3] = within(
        screen.getByRole('list', { name: 'Steps' })
      ).getAllByRole('listitem')
      expect(getStatus(step1)).toEqual('PASSED')
      expect(getStatus(step2)).toEqual('PASSED')
      expect(getStatus(step3)).toEqual('FAILED')
      expect(screen.getByText(/Expected values to be strictly equal/)).toBeVisible()
    })

    it('should render the results for individual examples - undefined', () => {
      userEvent.click(screen.getAllByRole('button', { name: 'Detail' })[4])

      expect(screen.getByText('@undefined')).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Example: eating cucumbers' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Given there are 12 cucumbers' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'When I eat banana cucumbers' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Then I should have 12 cucumbers' })).toBeVisible()
      const [step1, step2, step3] = within(
        screen.getByRole('list', { name: 'Steps' })
      ).getAllByRole('listitem')
      expect(getStatus(step1)).toEqual('PASSED')
      expect(getStatus(step2)).toEqual('UNDEFINED')
      expect(getStatus(step3)).toEqual('SKIPPED')
    })

    it('should allow returning to the outline from an example detail', () => {
      userEvent.click(screen.getAllByRole('button', { name: 'Detail' })[0])
      expect(screen.getByRole('heading', { name: 'Example: eating cucumbers' })).toBeVisible()

      userEvent.click(screen.getByRole('button', { name: 'Back to outline and all 6 examples' }))
      expect(
        screen.getByRole('heading', { name: 'Scenario Outline: eating cucumbers' })
      ).toBeVisible()
    })
  })
})
