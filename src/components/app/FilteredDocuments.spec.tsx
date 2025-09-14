import { TestStepResultStatus } from '@cucumber/messages'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'

import attachments from '../../../acceptance/attachments/attachments.js'
import examplesTables from '../../../acceptance/examples-tables/examples-tables.js'
import randomOrderRun from '../../../samples/random-order-run.js'
import targetedRun from '../../../samples/targeted-run.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { FilteredDocuments } from './FilteredDocuments.js'
import { InMemorySearchProvider } from './InMemorySearchProvider.js'

describe('FilteredDocuments', () => {
  describe('with a targeted run', () => {
    it('doesnt include features where no scenarios became test cases', async () => {
      const { getByRole, queryByRole } = render(
        <EnvelopesProvider envelopes={targetedRun}>
          <FilteredDocuments />
        </EnvelopesProvider>
      )

      await waitFor(() => {
        expect(
          getByRole('heading', {
            name: 'features/adding.feature',
          })
        ).to.be.visible
        expect(
          queryByRole('heading', {
            name: 'features/editing.feature',
          })
        ).not.to.exist
        expect(
          queryByRole('heading', {
            name: 'features/empty.feature',
          })
        ).not.to.exist
      })
    })

    it('displays features in alphabetical order by URI', async () => {
      const { getAllByRole } = render(
        <EnvelopesProvider envelopes={randomOrderRun}>
          <FilteredDocuments />
        </EnvelopesProvider>
      )

      await waitFor(() => {
        const headings = getAllByRole('heading', { level: 3 })
        const featureNames = headings.map((heading: HTMLElement) => heading.textContent)

        // Verify the features are displayed in alphabetical order by URI
        expect(featureNames).to.deep.equal([
          'Features/a.feature',
          'Features/B.feature',
          'Features/c.feature',
          'Features/d/e.feature',
          'Features/f.feature',
        ])
      })
    })
  })

  describe('searching', () => {
    it('shows a message for a search term that yields no results', async () => {
      const { getByText } = render(
        <EnvelopesProvider envelopes={attachments}>
          <InMemorySearchProvider defaultQuery="nope!">
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() => {
        expect(getByText('No matches found for your query and/or filters')).to.be.visible
      })
    })

    it('narrows the results with a valid search term', async () => {
      const { getByRole, getByText, queryByRole } = render(
        <EnvelopesProvider envelopes={attachments}>
          <InMemorySearchProvider defaultQuery="json">
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )
      await waitFor(() => getByText('samples/attachments/attachments.feature'))

      await userEvent.click(
        getByRole('button', { name: 'samples/attachments/attachments.feature' })
      )

      expect(getByRole('heading', { name: 'Scenario: Log JSON' })).to.be.visible
      expect(queryByRole('heading', { name: 'Scenario: Log text' })).not.to.exist
    })
  })

  describe('filtering by status', () => {
    it('should show a message if we filter all statuses out', async () => {
      const { queryByRole, getByText } = render(
        <EnvelopesProvider envelopes={examplesTables}>
          <InMemorySearchProvider
            defaultHideStatuses={[
              TestStepResultStatus.PASSED,
              TestStepResultStatus.FAILED,
              TestStepResultStatus.UNDEFINED,
            ]}
          >
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() => {
        expect(
          queryByRole('heading', {
            name: 'samples/examples-tables/examples-tables.feature',
          })
        ).not.to.exist
        expect(getByText('No matches found for your query and/or filters')).to.be.visible
      })
    })
  })
})
