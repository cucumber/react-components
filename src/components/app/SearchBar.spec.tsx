import { TestStepResultStatus } from '@cucumber/messages'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'
import { type FC, useState } from 'react'
import sinon from 'sinon'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.js'
import minimalFeature from '../../../acceptance/minimal/minimal.js'
import type { SearchState } from '../../SearchContext.js'
import { ControlledSearchProvider } from './ControlledSearchProvider.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { SearchBar } from './SearchBar.js'

const TestableSearchBar: FC<{
  defaultValue?: SearchState
  onChange?: (value: SearchState) => void
}> = ({ defaultValue = { query: '', hideStatuses: [] }, onChange = () => {} }) => {
  const [value, setValue] = useState<SearchState>(defaultValue)
  return (
    <ControlledSearchProvider
      value={value}
      onChange={(newValue) => {
        setValue(newValue)
        onChange(newValue)
      }}
    >
      <SearchBar />
    </ControlledSearchProvider>
  )
}

describe('SearchBar', () => {
  describe('searching', () => {
    it('puts the current query as the initial search text', () => {
      const { getByRole } = render(
        <TestableSearchBar defaultValue={{ query: 'keyword', hideStatuses: [] }} />
      )

      expect(getByRole('textbox', { name: 'Search' })).to.have.value('keyword')
    })

    it('updates the search context after half a second when the user types a query', async () => {
      const onChange = sinon.fake()
      const { getByRole } = render(<TestableSearchBar onChange={onChange} />)

      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'search text')
      expect(onChange).not.to.have.been.called

      await new Promise((resolve) => setTimeout(resolve, 500))
      expect(onChange).to.have.been.calledOnceWithExactly({
        query: 'search text',
        hideStatuses: [],
      })
    })

    it('updates the search context with the query when the form is submitted', async () => {
      const onChange = sinon.fake()
      const { getByRole } = render(<TestableSearchBar onChange={onChange} />)

      await userEvent.clear(getByRole('textbox', { name: 'Search' }))
      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'search text')
      await userEvent.keyboard('{Enter}')

      expect(onChange).to.have.been.calledOnceWithExactly({
        query: 'search text',
        hideStatuses: [],
      })
    })

    it("doesn't perform the default form action when submitting", async () => {
      const eventListener = sinon.fake()
      const { getByRole, baseElement } = render(<TestableSearchBar />)

      baseElement.ownerDocument.addEventListener('submit', eventListener)

      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'search text')
      await userEvent.keyboard('{Enter}')

      expect(eventListener).to.have.callCount(1)
      expect(eventListener.firstCall.firstArg.defaultPrevented).to.eq(true)
    })

    it('updates the search context with empty string when empty search is submitted', async () => {
      const onChange = sinon.fake()
      const { getByRole } = render(
        <TestableSearchBar
          defaultValue={{ query: 'keyword', hideStatuses: [] }}
          onChange={onChange}
        />
      )

      await userEvent.clear(getByRole('textbox', { name: 'Search' }))
      await userEvent.keyboard('{Enter}')

      expect(onChange).to.have.been.calledOnceWith({ query: '', hideStatuses: [] })
    })
  })

  describe('filtering by status', () => {
    it('should not show status filters when no statuses', () => {
      const { queryByRole } = render(
        <EnvelopesProvider envelopes={[]}>
          <TestableSearchBar />
        </EnvelopesProvider>
      )

      expect(queryByRole('checkbox')).not.to.exist
    })

    it('should not show status filters when just one status', () => {
      const { queryByRole } = render(
        <EnvelopesProvider envelopes={minimalFeature}>
          <TestableSearchBar />
        </EnvelopesProvider>
      )

      expect(queryByRole('checkbox')).not.to.exist
    })

    it('should show named status filters, all checked by default, when multiple statuses', () => {
      const { getAllByRole, getByRole } = render(
        <EnvelopesProvider envelopes={examplesTablesFeature}>
          <TestableSearchBar />
        </EnvelopesProvider>
      )

      expect(getAllByRole('checkbox')).to.have.length(2)
      expect(getByRole('checkbox', { name: 'passed 5' })).to.be.visible
      expect(getByRole('checkbox', { name: 'failed 2' })).to.be.visible
      getAllByRole('checkbox').forEach((checkbox: HTMLInputElement) => {
        expect(checkbox).to.be.checked
      })
    })

    it('updates the search context with a hidden status when unchecked', async () => {
      const onChange = sinon.fake()
      const { getByRole } = render(
        <EnvelopesProvider envelopes={examplesTablesFeature}>
          <TestableSearchBar onChange={onChange} />
        </EnvelopesProvider>
      )

      await userEvent.click(getByRole('checkbox', { name: 'failed 2' }))

      expect(onChange).to.have.been.calledOnceWithExactly({
        query: '',
        hideStatuses: [TestStepResultStatus.FAILED],
      })
    })

    it('should show hidden statuses as unchecked', () => {
      const { getByRole } = render(
        <EnvelopesProvider envelopes={examplesTablesFeature}>
          <TestableSearchBar
            defaultValue={{ query: '', hideStatuses: [TestStepResultStatus.FAILED] }}
          />
        </EnvelopesProvider>
      )

      expect(getByRole('checkbox', { name: 'passed 5' })).to.be.checked
      expect(getByRole('checkbox', { name: 'failed 2' })).not.to.be.checked
    })

    it('updates the search context when a status is rechecked', async () => {
      const onChange = sinon.fake()
      const { getByRole } = render(
        <EnvelopesProvider envelopes={examplesTablesFeature}>
          <TestableSearchBar
            defaultValue={{
              query: '',
              hideStatuses: [TestStepResultStatus.FAILED, TestStepResultStatus.PASSED],
            }}
            onChange={onChange}
          />
        </EnvelopesProvider>
      )

      await userEvent.click(getByRole('checkbox', { name: 'failed 2' }))

      expect(onChange).to.have.been.calledOnceWithExactly({
        query: '',
        hideStatuses: [TestStepResultStatus.PASSED],
      })
    })
  })
})
