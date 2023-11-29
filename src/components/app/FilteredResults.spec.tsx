import { Envelope } from '@cucumber/messages'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { VoidFunctionComponent } from 'react'

import attachments from '../../../acceptance/attachments/attachments.feature.js'
import examplesTables from '../../../acceptance/examples-tables/examples-tables.feature.js'
import minimal from '../../../acceptance/minimal/minimal.feature.js'
import targetedRun from '../../../samples/targeted-run.js'
import SearchQueryContext, { useSearchQueryCtx } from '../../SearchQueryContext.js'
import { EnvelopesWrapper } from './EnvelopesWrapper.js'
import { FilteredResults } from './FilteredResults.js'

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

  describe('with a targeted run', () => {
    it('doesnt include features where no scenarios became test cases', () => {
      const { getByRole, queryByRole } = render(
        <TestableFilteredResults envelopes={targetedRun as Envelope[]} />
      )

      expect(
        getByRole('heading', {
          name: 'features/adding.feature',
        })
      ).toBeVisible()
      expect(
        queryByRole('heading', {
          name: 'features/editing.feature',
        })
      ).not.toBeInTheDocument()
      expect(
        queryByRole('heading', {
          name: 'features/empty.feature',
        })
      ).not.toBeInTheDocument()
    })
  })

  describe('searching', () => {
    it('shows a message for a search term that yields no results', async () => {
      const { getByRole, getByText } = render(
        <TestableFilteredResults envelopes={attachments as Envelope[]} />
      )

      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'nope!')
      await userEvent.keyboard('{Enter}')

      expect(getByText('No matches found for your query "nope!" and/or filters')).toBeVisible()
    })

    it('narrows the results with a valid search term, and restores when we clear the search', async () => {
      const { getByRole, queryByRole } = render(
        <TestableFilteredResults envelopes={attachments as Envelope[]} />
      )

      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'json')
      await userEvent.keyboard('{Enter}')
      await userEvent.click(
        getByRole('button', { name: 'samples/attachments/attachments.feature' })
      )

      expect(getByRole('heading', { name: 'Scenario: Log JSON' })).toBeVisible()
      expect(queryByRole('heading', { name: 'Scenario: Log text' })).not.toBeInTheDocument()

      await userEvent.clear(getByRole('textbox', { name: 'Search' }))
      await userEvent.keyboard('{Enter}')

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

    it('should hide features with a certain status when we uncheck it', async () => {
      const { getByRole, queryByRole } = render(
        <TestableFilteredResults envelopes={[...examplesTables, ...minimal] as Envelope[]} />
      )

      expect(
        getByRole('heading', { name: 'samples/examples-tables/examples-tables.feature' })
      ).toBeVisible()
      expect(getByRole('heading', { name: 'samples/minimal/minimal.feature' })).toBeVisible()

      await userEvent.click(getByRole('checkbox', { name: 'passed' }))

      expect(
        getByRole('heading', { name: 'samples/examples-tables/examples-tables.feature' })
      ).toBeVisible()
      expect(
        queryByRole('heading', {
          name: 'samples/minimal/minimal.feature',
        })
      ).not.toBeInTheDocument()
    })

    it('should show a message if we filter all statuses out', async () => {
      const { getByRole, queryByRole, getByText } = render(
        <TestableFilteredResults envelopes={examplesTables as Envelope[]} />
      )

      expect(
        getByRole('heading', { name: 'samples/examples-tables/examples-tables.feature' })
      ).toBeVisible()

      await userEvent.click(getByRole('checkbox', { name: 'passed' }))
      await userEvent.click(getByRole('checkbox', { name: 'failed' }))
      await userEvent.click(getByRole('checkbox', { name: 'undefined' }))

      expect(
        queryByRole('heading', {
          name: 'samples/examples-tables/examples-tables.feature',
        })
      ).not.toBeInTheDocument()
      expect(getByText('No matches found for your filters')).toBeVisible()
    })
  })
})
