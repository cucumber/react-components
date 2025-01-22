import { Envelope } from '@cucumber/messages'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'
import React, { FC } from 'react'

import attachments from '../../../acceptance/attachments/attachments.feature.js'
import examplesTables from '../../../acceptance/examples-tables/examples-tables.feature.js'
import minimal from '../../../acceptance/minimal/minimal.feature.js'
import targetedRun from '../../../samples/targeted-run.js'
import SearchQueryContext, { useSearchQueryCtx } from '../../SearchQueryContext.js'
import { EnvelopesWrapper } from './EnvelopesWrapper.js'
import { FilteredResults } from './FilteredResults.js'

describe('FilteredResults', () => {
  const TestableFilteredResults: FC<{ envelopes: Envelope[]; experimental?: boolean }> = ({
    envelopes,
    experimental,
  }) => {
    return (
      <EnvelopesWrapper envelopes={envelopes}>
        <SearchQueryContext.Provider value={useSearchQueryCtx({})}>
          <FilteredResults experimental={experimental} />
        </SearchQueryContext.Provider>
      </EnvelopesWrapper>
    )
  }

  describe('current gherkin-centric implementation', () => {
    describe('with a targeted run', () => {
      it('doesnt include features where no scenarios became test cases', async () => {
        const { getByRole, queryByRole } = render(
          <TestableFilteredResults envelopes={targetedRun as Envelope[]} />
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
    })

    describe('searching', () => {
      it('shows a message for a search term that yields no results', async () => {
        const { getByRole, getByText } = render(
          <TestableFilteredResults envelopes={attachments as Envelope[]} />
        )

        await waitFor(() => getByText('samples/attachments/attachments.feature'))

        await userEvent.type(getByRole('textbox', { name: 'Search' }), 'nope!')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
          expect(getByText('No matches found for your query "nope!" and/or filters')).to.be.visible
        })
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

        expect(getByRole('heading', { name: 'Scenario: Log JSON' })).to.be.visible
        expect(queryByRole('heading', { name: 'Scenario: Log text' })).not.to.exist

        await userEvent.clear(getByRole('textbox', { name: 'Search' }))
        await userEvent.keyboard('{Enter}')

        expect(getByRole('heading', { name: 'Scenario: Log JSON' })).to.be.visible
        expect(getByRole('heading', { name: 'Scenario: Log text' })).to.be.visible
      })
    })

    describe('filtering by status', () => {
      it('should not show filters when only one status', async () => {
        const { queryByRole } = render(
          <TestableFilteredResults envelopes={minimal as Envelope[]} />
        )

        await waitFor(() => {
          expect(queryByRole('checkbox')).not.to.exist
        })
      })

      it('should show named status filters, all checked by default', async () => {
        const { getAllByRole, getByRole } = render(
          <TestableFilteredResults envelopes={examplesTables as Envelope[]} />
        )

        await waitFor(() => {
          expect(getAllByRole('checkbox')).to.have.length(3)
          expect(getByRole('checkbox', { name: 'passed' })).to.be.visible
          expect(getByRole('checkbox', { name: 'failed' })).to.be.visible
          expect(getByRole('checkbox', { name: 'undefined' })).to.be.visible
          getAllByRole('checkbox').forEach((checkbox: HTMLInputElement) => {
            expect(checkbox).to.be.checked
          })
        })
      })

      it('should hide features with a certain status when we uncheck it', async () => {
        const { getByRole, queryByRole } = render(
          <TestableFilteredResults envelopes={[...examplesTables, ...minimal] as Envelope[]} />
        )

        await waitFor(() => {
          expect(getByRole('heading', { name: 'samples/examples-tables/examples-tables.feature' }))
            .to.be.visible
          expect(getByRole('heading', { name: 'samples/minimal/minimal.feature' })).to.be.visible
        })

        await userEvent.click(getByRole('checkbox', { name: 'passed' }))

        await waitFor(() => {
          expect(getByRole('heading', { name: 'samples/examples-tables/examples-tables.feature' }))
            .to.be.visible
          expect(
            queryByRole('heading', {
              name: 'samples/minimal/minimal.feature',
            })
          ).not.to.exist
        })
      })

      it('should show a message if we filter all statuses out', async () => {
        const { getByRole, queryByRole, getByText } = render(
          <TestableFilteredResults envelopes={examplesTables as Envelope[]} />
        )

        await waitFor(() => {
          expect(getByRole('heading', { name: 'samples/examples-tables/examples-tables.feature' }))
            .to.be.visible
        })

        await userEvent.click(getByRole('checkbox', { name: 'passed' }))
        await userEvent.click(getByRole('checkbox', { name: 'failed' }))
        await userEvent.click(getByRole('checkbox', { name: 'undefined' }))

        await waitFor(() => {
          expect(
            queryByRole('heading', {
              name: 'samples/examples-tables/examples-tables.feature',
            })
          ).not.to.exist
          expect(getByText('No matches found for your filters')).to.be.visible
        })
      })
    })
  })

  describe('new test case-centric implementation', () => {
    describe('filtering by status', () => {
      it('should not show filters when only one status', async () => {
        const { queryByRole } = render(
          <TestableFilteredResults envelopes={minimal as Envelope[]} experimental />
        )

        await waitFor(() => {
          expect(queryByRole('checkbox')).not.to.exist
        })
      })

      it('should show named status filters, all checked by default', async () => {
        const { getAllByRole, getByRole } = render(
          <TestableFilteredResults envelopes={examplesTables as Envelope[]} experimental />
        )

        await waitFor(() => {
          expect(getAllByRole('checkbox')).to.have.length(3)
          expect(getByRole('checkbox', { name: 'passed' })).to.be.visible
          expect(getByRole('checkbox', { name: 'failed' })).to.be.visible
          expect(getByRole('checkbox', { name: 'undefined' })).to.be.visible
          getAllByRole('checkbox').forEach((checkbox: HTMLInputElement) => {
            expect(checkbox).to.be.checked
          })
        })
      })

      it('should hide test cases with a certain status when we uncheck it', async () => {
        const { getByRole, queryByRole } = render(
          <TestableFilteredResults envelopes={examplesTables as Envelope[]} experimental />
        )

        await waitFor(() => {
          // passing
          expect(
            getByRole('heading', {
              name: 'Examples Tables - Eating cucumbers - These are passing - #1.1',
            })
          ).to.be.visible
          // failing
          expect(
            getByRole('heading', {
              name: 'Examples Tables - Eating cucumbers - These are failing - #2.1',
            })
          ).to.be.visible
          // undefined
          expect(
            getByRole('heading', {
              name: 'Examples Tables - Eating cucumbers - These are undefined because the value is not an {int} - #3.1',
            })
          ).to.be.visible
        })

        await userEvent.click(getByRole('checkbox', { name: 'passed' }))

        await waitFor(() => {
          // passing
          expect(
            queryByRole('heading', {
              name: 'Examples Tables - Eating cucumbers - These are passing - #1.1',
            })
          ).not.to.exist
          // failing
          expect(
            getByRole('heading', {
              name: 'Examples Tables - Eating cucumbers - These are failing - #2.1',
            })
          ).to.be.visible
          // undefined
          expect(
            getByRole('heading', {
              name: 'Examples Tables - Eating cucumbers - These are undefined because the value is not an {int} - #3.1',
            })
          ).to.be.visible
        })
      })

      it('should show a message if we filter all statuses out', async () => {
        const { getByRole, queryByRole, getByText } = render(
          <TestableFilteredResults envelopes={examplesTables as Envelope[]} experimental />
        )

        await waitFor(() => {
          expect(
            getByRole('heading', {
              name: 'Examples Tables - Eating cucumbers - These are passing - #1.1',
            })
          ).to.be.visible
        })

        await userEvent.click(getByRole('checkbox', { name: 'passed' }))
        await userEvent.click(getByRole('checkbox', { name: 'failed' }))
        await userEvent.click(getByRole('checkbox', { name: 'undefined' }))

        await waitFor(() => {
          expect(
            queryByRole('heading', {
              name: 'Examples Tables - Eating cucumbers - These are passing - #1.1',
            })
          ).not.to.exist
          expect(getByText('No matches found for your filters')).to.be.visible
        })
      })
    })
  })
})
