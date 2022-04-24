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
  })
})
