import { TestStepResultStatus } from '@cucumber/messages'
import { renderHook, waitFor } from '@testing-library/react'
import { expect } from 'chai'

import attachments from '../../acceptance/attachments/attachments.js'
import backgrounds from '../../acceptance/backgrounds/backgrounds.js'
import hooksConditional from '../../acceptance/hooks-conditional/hooks-conditional.js'
import retry from '../../acceptance/retry/retry.js'
import rules from '../../acceptance/rules/rules.js'
import { EnvelopesProvider } from '../components/app/EnvelopesProvider.js'
import { InMemorySearchProvider } from '../components/app/InMemorySearchProvider.js'
import { useFilteredTestCases } from './useFilteredTestCases.js'

interface ProviderProps {
  envelopes: Parameters<typeof EnvelopesProvider>[0]['envelopes']
  defaultQuery?: string
  defaultHideStatuses?: readonly TestStepResultStatus[]
}

function renderAndExtractPickleNames({
  envelopes,
  defaultQuery,
  defaultHideStatuses,
}: ProviderProps) {
  return renderHook(() => useFilteredTestCases().map(({ pickle }) => pickle.name), {
    wrapper: ({ children }) => (
      <EnvelopesProvider envelopes={envelopes}>
        <InMemorySearchProvider
          defaultQuery={defaultQuery}
          defaultHideStatuses={defaultHideStatuses}
        >
          {children}
        </InMemorySearchProvider>
      </EnvelopesProvider>
    ),
  })
}

describe('useFilteredTestCases', () => {
  describe('with no filters', () => {
    it('returns a test case for every finished scenario', async () => {
      const { result } = renderAndExtractPickleNames({ envelopes: hooksConditional })

      await waitFor(() =>
        expect(result.current).to.have.members([
          'A failure in the before hook and a skipped step',
          'A failure in the after hook and a passed step',
          'With an tag, a passed step and hook',
        ])
      )
    })
  })

  describe('filtering by tag expression', () => {
    it('keeps only test cases matching the tag expression', async () => {
      const { result } = renderAndExtractPickleNames({
        envelopes: hooksConditional,
        defaultQuery: '@fail-before',
      })

      await waitFor(() =>
        expect(result.current).to.have.members(['A failure in the before hook and a skipped step'])
      )
    })
  })

  describe('filtering by status', () => {
    it('keeps only test cases whose result is not hidden', async () => {
      const { result } = renderAndExtractPickleNames({
        envelopes: retry,
        defaultHideStatuses: [
          TestStepResultStatus.FAILED,
          TestStepResultStatus.SKIPPED,
          TestStepResultStatus.PENDING,
          TestStepResultStatus.UNDEFINED,
          TestStepResultStatus.AMBIGUOUS,
        ],
      })

      await waitFor(() => expect(result.current).to.include("Test cases that pass aren't retried"))
      expect(result.current).to.include(
        'Test cases that fail are retried if within the --retry limit'
      )
      expect(result.current).to.include(
        'Test cases that fail will continue to retry up to the --retry limit'
      )
      expect(result.current).not.to.include(
        "Test cases won't retry after failing more than the --retry limit"
      )
    })
  })

  describe('searching by text', () => {
    it('keeps test cases whose step matches', async () => {
      const { result } = renderAndExtractPickleNames({ envelopes: retry, defaultQuery: 'third' })

      await waitFor(() =>
        expect(result.current).to.include(
          'Test cases that fail will continue to retry up to the --retry limit'
        )
      )
      expect(result.current).not.to.include("Test cases that pass aren't retried")
      expect(result.current).not.to.include(
        'Test cases that fail are retried if within the --retry limit'
      )
      expect(result.current).not.to.include(
        "Test cases won't retry after failing more than the --retry limit"
      )
    })

    it('keeps test cases whose scenario name matches', async () => {
      const { result } = renderAndExtractPickleNames({
        envelopes: attachments,
        defaultQuery: 'JSON',
      })

      await waitFor(() => expect(result.current).to.include('Log JSON'))
      expect(result.current).not.to.include('Log text')
      expect(result.current).not.to.include('Log ANSI coloured text')
    })

    it('keeps test cases whose rule matches', async () => {
      const { result } = renderAndExtractPickleNames({
        envelopes: rules,
        defaultQuery: 'enough money',
      })

      await waitFor(() => expect(result.current).to.include('Enough money'))
      expect(result.current).to.include('Not enough money')
      expect(result.current).not.to.include('No chocolates left')
    })

    it('keeps all test cases under a matching feature', async () => {
      const { result } = renderAndExtractPickleNames({ envelopes: rules, defaultQuery: 'synonym' })

      await waitFor(() => expect(result.current).to.include('No chocolates left'))
      expect(result.current).to.include('Enough money')
      expect(result.current).to.include('Not enough money')
    })

    it('keeps all test cases under a matching background', async () => {
      const { result } = renderAndExtractPickleNames({
        envelopes: backgrounds,
        defaultQuery: 'eggs',
      })

      await waitFor(() => expect(result.current).to.include('one scenario'))
      expect(result.current).to.include('another scenario')
    })
  })
})
