import { TestStepResultStatus } from '@cucumber/messages'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.feature.js'
import minimalFeature from '../../../acceptance/minimal/minimal.feature.js'
import SearchQueryContext, { SearchQueryCtx } from '../../SearchQueryContext.js'
import { EnvelopesWrapper } from './EnvelopesWrapper.js'
import { SearchBar } from './SearchBar.js'

describe('SearchBar', () => {
  describe('searching', () => {
    it('puts the current query as the initial search text', () => {
      const searchQueryContext = SearchQueryCtx.withDefaults({
        query: 'keyword',
      })
      const { getByRole } = render(
        <SearchQueryContext.Provider value={searchQueryContext}>
          <SearchBar />
        </SearchQueryContext.Provider>
      )

      expect(getByRole('textbox', { name: 'Search' })).to.have.value('keyword')
    })

    it('updates the search context after half a second when the user types a query', async () => {
      const onUpdate = sinon.fake()
      const searchQueryContext = SearchQueryCtx.withDefaults({}, onUpdate)
      const { getByRole } = render(
        <SearchQueryContext.Provider value={searchQueryContext}>
          <SearchBar />
        </SearchQueryContext.Provider>
      )

      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'search text')
      expect(onUpdate).not.to.have.been.called

      await new Promise((resolve) => setTimeout(resolve, 500))
      expect(onUpdate).to.have.been.calledOnceWithExactly({
        query: 'search text',
        hideStatuses: [],
      })
    })

    it('updates the search context with the query when the form is submitted', async () => {
      const onUpdate = sinon.fake()
      const searchQueryContext = SearchQueryCtx.withDefaults({}, onUpdate)
      const { getByRole } = render(
        <SearchQueryContext.Provider value={searchQueryContext}>
          <SearchBar />
        </SearchQueryContext.Provider>
      )

      await userEvent.clear(getByRole('textbox', { name: 'Search' }))
      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'search text')
      await userEvent.keyboard('{Enter}')

      expect(onUpdate).to.have.been.calledOnceWithExactly({
        query: 'search text',
        hideStatuses: [],
      })
    })

    it("doesn't perform the default form action when submitting", async () => {
      const eventListener = sinon.fake()
      const searchQueryContext = SearchQueryCtx.withDefaults()
      const { getByRole, baseElement } = render(
        <SearchQueryContext.Provider value={searchQueryContext}>
          <SearchBar />
        </SearchQueryContext.Provider>
      )

      baseElement.ownerDocument.addEventListener('submit', eventListener)

      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'search text')
      await userEvent.keyboard('{Enter}')

      expect(eventListener).to.have.callCount(1)
      expect(eventListener.firstCall.firstArg.defaultPrevented).to.eq(true)
    })

    it('updates the search context with empty string when empty search is submitted', async () => {
      const onUpdate = sinon.fake()
      const searchQueryContext = SearchQueryCtx.withDefaults(
        {
          query: 'keyword',
        },
        onUpdate
      )
      const { getByRole } = render(
        <SearchQueryContext.Provider value={searchQueryContext}>
          <SearchBar />
        </SearchQueryContext.Provider>
      )

      await userEvent.clear(getByRole('textbox', { name: 'Search' }))
      await userEvent.keyboard('{Enter}')

      expect(onUpdate).to.have.been.calledOnceWith({ query: '', hideStatuses: [] })
    })
  })

  describe('filtering by status', () => {
    it('should not show status filters when no statuses', () => {
      const searchQueryContext = SearchQueryCtx.withDefaults()
      const { queryByRole } = render(
        <EnvelopesWrapper envelopes={[]}>
          <SearchQueryContext.Provider value={searchQueryContext}>
            <SearchBar />
          </SearchQueryContext.Provider>
        </EnvelopesWrapper>
      )

      expect(queryByRole('checkbox')).not.to.exist
    })

    it('should not show status filters when just one status', () => {
      const searchQueryContext = SearchQueryCtx.withDefaults()
      const { queryByRole } = render(
        <EnvelopesWrapper envelopes={minimalFeature}>
          <SearchQueryContext.Provider value={searchQueryContext}>
            <SearchBar />
          </SearchQueryContext.Provider>
        </EnvelopesWrapper>
      )

      expect(queryByRole('checkbox')).not.to.exist
    })

    it('should show named status filters, all checked by default, when multiple statuses', () => {
      const searchQueryContext = SearchQueryCtx.withDefaults()
      const { getAllByRole, getByRole } = render(
        <EnvelopesWrapper envelopes={examplesTablesFeature}>
          <SearchQueryContext.Provider value={searchQueryContext}>
            <SearchBar />
          </SearchQueryContext.Provider>
        </EnvelopesWrapper>
      )

      expect(getAllByRole('checkbox')).to.have.length(3)
      expect(getByRole('checkbox', { name: 'passed' })).to.be.visible
      expect(getByRole('checkbox', { name: 'undefined' })).to.be.visible
      expect(getByRole('checkbox', { name: 'failed' })).to.be.visible
      getAllByRole('checkbox').forEach((checkbox: HTMLInputElement) => {
        expect(checkbox).to.be.checked
      })
    })

    it('updates the search context with a hidden status when unchecked', async () => {
      const onUpdate = sinon.fake()
      const searchQueryContext = SearchQueryCtx.withDefaults({}, onUpdate)
      const { getByRole } = render(
        <EnvelopesWrapper envelopes={examplesTablesFeature}>
          <SearchQueryContext.Provider value={searchQueryContext}>
            <SearchBar />
          </SearchQueryContext.Provider>
        </EnvelopesWrapper>
      )

      await userEvent.click(getByRole('checkbox', { name: 'undefined' }))

      expect(onUpdate).to.have.been.calledOnceWithExactly({
        query: '',
        hideStatuses: [TestStepResultStatus.UNDEFINED],
      })
    })

    it('should show hidden statuses as unchecked', () => {
      const searchQueryContext = SearchQueryCtx.withDefaults({
        hideStatuses: [TestStepResultStatus.UNDEFINED],
      })
      const { getByRole } = render(
        <EnvelopesWrapper envelopes={examplesTablesFeature}>
          <SearchQueryContext.Provider value={searchQueryContext}>
            <SearchBar />
          </SearchQueryContext.Provider>
        </EnvelopesWrapper>
      )

      expect(getByRole('checkbox', { name: 'passed' })).to.be.checked
      expect(getByRole('checkbox', { name: 'failed' })).to.be.checked
      expect(getByRole('checkbox', { name: 'undefined' })).not.to.be.checked
    })

    it('updates the search context when a status is rechecked', async () => {
      const onUpdate = sinon.fake()
      const searchQueryContext = SearchQueryCtx.withDefaults(
        {
          hideStatuses: [TestStepResultStatus.FAILED, TestStepResultStatus.UNDEFINED],
        },
        onUpdate
      )
      const { getByRole } = render(
        <EnvelopesWrapper envelopes={examplesTablesFeature}>
          <SearchQueryContext.Provider value={searchQueryContext}>
            <SearchBar />
          </SearchQueryContext.Provider>
        </EnvelopesWrapper>
      )

      await userEvent.click(getByRole('checkbox', { name: 'failed' }))

      expect(onUpdate).to.have.been.calledOnceWithExactly({
        query: '',
        hideStatuses: [TestStepResultStatus.UNDEFINED],
      })
    })
  })
})
