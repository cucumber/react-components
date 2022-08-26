import { TestStepResultStatus } from '@cucumber/messages'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  describe('searching', () => {
    it('puts the current query as the initial search text', () => {
      const { getByRole } = render(
        <SearchBar
          query={'keyword'}
          onSearch={jest.fn()}
          hideStatuses={[]}
          statusesWithScenarios={[]}
          onFilter={jest.fn()}
        />
      )

      expect(getByRole('textbox', { name: 'Search' })).toHaveValue('keyword')
    })

    it('fires an event with the query when the form is submitted', async () => {
      const onChange = jest.fn()
      const { getByRole } = render(
        <SearchBar
          query={'keyword'}
          onSearch={onChange}
          hideStatuses={[]}
          statusesWithScenarios={[]}
          onFilter={jest.fn()}
        />
      )

      await userEvent.clear(getByRole('textbox', { name: 'Search' }))
      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'search text')
      await userEvent.keyboard('{Enter}')

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith('search text')
    })

    it("doesn't perform the default form action when submitting", async () => {
      const eventListener = jest.fn()
      const { getByRole, baseElement } = render(
        <SearchBar
          query={''}
          onSearch={jest.fn()}
          hideStatuses={[]}
          statusesWithScenarios={[]}
          onFilter={jest.fn()}
        />
      )

      baseElement.ownerDocument.addEventListener('submit', eventListener)

      await userEvent.type(getByRole('textbox', { name: 'Search' }), 'search text')
      await userEvent.keyboard('{Enter}')

      expect(eventListener).toHaveBeenCalledTimes(1)
      expect(eventListener.mock.calls[0][0]).toMatchObject({
        defaultPrevented: true,
      })
    })

    it('fires an event with empty string when empty search is submitted', async () => {
      const onChange = jest.fn()
      const { getByRole } = render(
        <SearchBar
          query={'keyword'}
          onSearch={onChange}
          hideStatuses={[]}
          statusesWithScenarios={[]}
          onFilter={jest.fn()}
        />
      )

      await userEvent.clear(getByRole('textbox', { name: 'Search' }))
      await userEvent.keyboard('{Enter}')

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith('')
    })
  })

  describe('filtering by status', () => {
    it('should not show status filters when no statuses', () => {
      const { queryByRole } = render(
        <SearchBar
          query=""
          onSearch={jest.fn()}
          statusesWithScenarios={[]}
          hideStatuses={[]}
          onFilter={jest.fn()}
        />
      )

      expect(queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('should not show status filters when just one status', () => {
      const { queryByRole } = render(
        <SearchBar
          query=""
          onSearch={jest.fn()}
          statusesWithScenarios={[TestStepResultStatus.PASSED]}
          hideStatuses={[]}
          onFilter={jest.fn()}
        />
      )

      expect(queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('should show named status filters, all checked by default, when multiple statuses', () => {
      const { getAllByRole, getByRole } = render(
        <SearchBar
          query=""
          onSearch={jest.fn()}
          statusesWithScenarios={[TestStepResultStatus.PASSED, TestStepResultStatus.FAILED]}
          hideStatuses={[]}
          onFilter={jest.fn()}
        />
      )

      expect(getAllByRole('checkbox')).toHaveLength(2)
      expect(getByRole('checkbox', { name: 'passed' })).toBeVisible()
      expect(getByRole('checkbox', { name: 'failed' })).toBeVisible()
      getAllByRole('checkbox').forEach((checkbox: HTMLInputElement) => {
        expect(checkbox).toBeChecked()
      })
    })

    it('should fire an event to hide a status when unchecked', async () => {
      const onFilter = jest.fn()
      const { getByRole } = render(
        <SearchBar
          query=""
          onSearch={jest.fn()}
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

      expect(onFilter).toHaveBeenCalledTimes(1)
      expect(onFilter).toHaveBeenCalledWith([TestStepResultStatus.PENDING])
    })

    it('should show filtered out statuses as unchecked', () => {
      const { getByRole } = render(
        <SearchBar
          query=""
          onSearch={jest.fn()}
          statusesWithScenarios={[
            TestStepResultStatus.PASSED,
            TestStepResultStatus.FAILED,
            TestStepResultStatus.PENDING,
          ]}
          hideStatuses={[TestStepResultStatus.PENDING]}
          onFilter={jest.fn()}
        />
      )

      expect(getByRole('checkbox', { name: 'passed' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'failed' })).toBeChecked()
      expect(getByRole('checkbox', { name: 'pending' })).not.toBeChecked()
    })

    it('should fire to unhide a status when rechecked', async () => {
      const onFilter = jest.fn()
      const { getByRole } = render(
        <SearchBar
          query=""
          onSearch={jest.fn()}
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

      expect(onFilter).toHaveBeenCalledTimes(1)
      expect(onFilter).toHaveBeenCalledWith([TestStepResultStatus.PENDING])
    })
  })
})
