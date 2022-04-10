import { Envelope } from '@cucumber/messages'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { VoidFunctionComponent } from 'react'

import attachments from '../../../acceptance/attachments/attachments.feature'
import examplesTables from '../../../acceptance/examples-tables/examples-tables.feature'
import minimal from '../../../acceptance/minimal/minimal.feature'
import SearchQueryContext, { useSearchQueryCtx } from '../../SearchQueryContext'
import { EnvelopesWrapper } from './EnvelopesWrapper'
import { FilteredResults } from './FilteredResults'

describe('FilteredResults', () => {
  const TestableFilteredResults: VoidFunctionComponent<{ envelopes: Envelope[] }> = ({
    envelopes,
  }) => {
    return (
      <EnvelopesWrapper envelopes={envelopes}>
        <SearchQueryContext.Provider value={useSearchQueryCtx({})}>
          <FilteredResults />
        </SearchQueryContext.Provider>
      </EnvelopesWrapper>
    )
  }

  describe('searching', () => {
    it('shows a message for a search term that yields no results', () => {
      const { getByRole, getByText } = render(
        <TestableFilteredResults envelopes={attachments as Envelope[]} />
      )

      userEvent.type(getByRole('textbox', { name: 'Search' }), 'nope!')
      userEvent.keyboard('{Enter}')

      expect(getByText('No matches found for your query "nope!" and/or filters')).toBeVisible()
    })

    it('narrows the results with a valid search term, and restores when we clear the search', () => {
      const { getByRole, queryByRole } = render(
        <TestableFilteredResults envelopes={attachments as Envelope[]} />
      )

      userEvent.type(getByRole('textbox', { name: 'Search' }), 'json')
      userEvent.keyboard('{Enter}')
      userEvent.click(getByRole('button', { name: 'features/attachments/attachments.feature' }))

      expect(getByRole('heading', { name: 'Scenario: Log JSON' })).toBeVisible()
      expect(queryByRole('heading', { name: 'Scenario: Log text' })).not.toBeInTheDocument()

      userEvent.clear(getByRole('textbox', { name: 'Search' }))
      userEvent.keyboard('{Enter}')

      expect(getByRole('heading', { name: 'Scenario: Log JSON' })).toBeVisible()
      expect(getByRole('heading', { name: 'Scenario: Log text' })).toBeVisible()
    })
  })

  describe('filtering by status', () => {
    it('should not show filters when only one status', () => {
      const { queryByRole } = render(<TestableFilteredResults envelopes={minimal as Envelope[]} />)

      expect(queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('should show named status filters, all checked by default', () => {
      const { getAllByRole, getByRole } = render(
        <TestableFilteredResults envelopes={examplesTables as Envelope[]} />
      )

      expect(getAllByRole('checkbox')).toHaveLength(3)
      expect(getByRole('checkbox', { name: 'passed' })).toBeVisible()
      expect(getByRole('checkbox', { name: 'failed' })).toBeVisible()
      expect(getByRole('checkbox', { name: 'undefined' })).toBeVisible()
      getAllByRole('checkbox').forEach((checkbox: HTMLInputElement) => {
        expect(checkbox).toBeChecked()
      })
    })

    it('should hide features with a certain status when we uncheck it', () => {
      const { getByRole, queryByRole } = render(
        <TestableFilteredResults envelopes={[...examplesTables, ...minimal] as Envelope[]} />
      )

      expect(
        getByRole('heading', { name: 'features/examples-tables/examples-tables.feature' })
      ).toBeVisible()
      expect(getByRole('heading', { name: 'features/minimal/minimal.feature' })).toBeVisible()

      userEvent.click(getByRole('checkbox', { name: 'passed' }))

      expect(
        getByRole('heading', { name: 'features/examples-tables/examples-tables.feature' })
      ).toBeVisible()
      expect(
        queryByRole('heading', {
          name: 'features/minimal/minimal.feature',
        })
      ).not.toBeInTheDocument()
    })

    it('should show a message if we filter all statuses out', () => {
      const { getByRole, queryByRole, getByText } = render(
        <TestableFilteredResults envelopes={examplesTables as Envelope[]} />
      )

      expect(
        getByRole('heading', { name: 'features/examples-tables/examples-tables.feature' })
      ).toBeVisible()

      userEvent.click(getByRole('checkbox', { name: 'passed' }))
      userEvent.click(getByRole('checkbox', { name: 'failed' }))
      userEvent.click(getByRole('checkbox', { name: 'undefined' }))

      expect(
        queryByRole('heading', {
          name: 'features/examples-tables/examples-tables.feature',
        })
      ).not.toBeInTheDocument()
      expect(getByText('No matches found for your filters')).toBeVisible()
    })
  })
})
