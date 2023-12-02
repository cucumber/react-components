import { TestStepResultStatus } from '@cucumber/messages'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'

import { SearchBar } from './SearchBar.js'

describe('SearchBar', () => {
  describe('searching', () => {
    it('puts the current query as the initial search text', () => {
      const { getByRole } = render(
        <SearchBar
          query={'keyword'}
          onSearch={sinon.fake()}
          hideStatuses={[]}
          statusesWithScenarios={[]}
          onFilter={sinon.fake()}
        />
      )

      expect(getByRole('textbox', { name: 'Search' })).to.have.value('keyword')
    })

    it('fires an event with the query when the form is submitted', async () => {
      const onChange = sinon.fake()
      const { getByRole } = render(
        <SearchBar
          query={'keyword'}
          onSearch={onChange}
          hideStatuses={[]}
          statusesWithScenarios={[]}
          onFilter={sinon.fake()}
        />
      )

      await userEvent.clear(getByRole('textbox', { name: 'Search' }))
      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'search text')
      await userEvent.keyboard('{Enter}')

      expect(onChange).to.have.been.calledOnceWith('search text')
    })

    it("doesn't perform the default form action when submitting", async () => {
      const eventListener = sinon.fake()
      const { getByRole, baseElement } = render(
        <SearchBar
          query={''}
          onSearch={sinon.fake()}
          hideStatuses={[]}
          statusesWithScenarios={[]}
          onFilter={sinon.fake()}
        />
      )

      baseElement.ownerDocument.addEventListener('submit', eventListener)

      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'search text')
      await userEvent.keyboard('{Enter}')

      expect(eventListener).to.have.callCount(1)
      expect(eventListener.firstCall.firstArg.defaultPrevented).to.eq(true)
    })

    it('fires an event with empty string when empty search is submitted', async () => {
      const onChange = sinon.fake()
      const { getByRole } = render(
        <SearchBar
          query={'keyword'}
          onSearch={onChange}
          hideStatuses={[]}
          statusesWithScenarios={[]}
          onFilter={sinon.fake()}
        />
      )

      await userEvent.clear(getByRole('textbox', { name: 'Search' }))
      await userEvent.keyboard('{Enter}')

      expect(onChange).to.have.been.calledOnceWith('')
    })
  })

  describe('filtering by status', () => {
    it('should not show status filters when no statuses', () => {
      const { queryByRole } = render(
        <SearchBar
          query=""
          onSearch={sinon.fake()}
          statusesWithScenarios={[]}
          hideStatuses={[]}
          onFilter={sinon.fake()}
        />
      )

      expect(queryByRole('checkbox')).not.to.exist
    })

    it('should not show status filters when just one status', () => {
      const { queryByRole } = render(
        <SearchBar
          query=""
          onSearch={sinon.fake()}
          statusesWithScenarios={[TestStepResultStatus.PASSED]}
          hideStatuses={[]}
          onFilter={sinon.fake()}
        />
      )

      expect(queryByRole('checkbox')).not.to.exist
    })

    it('should show named status filters, all checked by default, when multiple statuses', () => {
      const { getAllByRole, getByRole } = render(
        <SearchBar
          query=""
          onSearch={sinon.fake()}
          statusesWithScenarios={[TestStepResultStatus.PASSED, TestStepResultStatus.FAILED]}
          hideStatuses={[]}
          onFilter={sinon.fake()}
        />
      )

      expect(getAllByRole('checkbox')).to.have.length(2)
      expect(getByRole('checkbox', { name: 'passed' })).to.be.visible
      expect(getByRole('checkbox', { name: 'failed' })).to.be.visible
      getAllByRole('checkbox').forEach((checkbox: HTMLInputElement) => {
        expect(checkbox).to.be.checked
      })
    })

    it('should fire an event to hide a status when unchecked', async () => {
      const onFilter = sinon.fake()
      const { getByRole } = render(
        <SearchBar
          query=""
          onSearch={sinon.fake()}
          statusesWithScenarios={[
            TestStepResultStatus.PASSED,
            TestStepResultStatus.FAILED,
            TestStepResultStatus.PENDING,
          ]}
          hideStatuses={[]}
          onFilter={onFilter}
        />
      )

      await userEvent.click(getByRole('checkbox', { name: 'pending' }))

      expect(onFilter).to.have.been.calledOnceWith([TestStepResultStatus.PENDING])
    })

    it('should show filtered out statuses as unchecked', () => {
      const { getByRole } = render(
        <SearchBar
          query=""
          onSearch={sinon.fake()}
          statusesWithScenarios={[
            TestStepResultStatus.PASSED,
            TestStepResultStatus.FAILED,
            TestStepResultStatus.PENDING,
          ]}
          hideStatuses={[TestStepResultStatus.PENDING]}
          onFilter={sinon.fake()}
        />
      )

      expect(getByRole('checkbox', { name: 'passed' })).to.be.checked
      expect(getByRole('checkbox', { name: 'failed' })).to.be.checked
      expect(getByRole('checkbox', { name: 'pending' })).not.to.be.checked
    })

    it('should fire to unhide a status when rechecked', async () => {
      const onFilter = sinon.fake()
      const { getByRole } = render(
        <SearchBar
          query=""
          onSearch={sinon.fake()}
          statusesWithScenarios={[
            TestStepResultStatus.PASSED,
            TestStepResultStatus.FAILED,
            TestStepResultStatus.PENDING,
          ]}
          hideStatuses={[TestStepResultStatus.FAILED, TestStepResultStatus.PENDING]}
          onFilter={onFilter}
        />
      )

      await userEvent.click(getByRole('checkbox', { name: 'failed' }))

      expect(onFilter).to.have.been.calledOnceWith([TestStepResultStatus.PENDING])
    })
  })
})
