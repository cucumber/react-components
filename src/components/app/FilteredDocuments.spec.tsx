import { TestStepResultStatus } from '@cucumber/messages'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'

import attachments from '../../../acceptance/attachments/attachments.js'
import examplesTables from '../../../acceptance/examples-tables/examples-tables.js'
import hooksConditional from '../../../acceptance/hooks-conditional/hooks-conditional.js'
import retry from '../../../acceptance/retry/retry.js'
import rules from '../../../acceptance/rules/rules.js'
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
        expect(getByText('No scenarios match your query and/or filters.')).to.be.visible
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

      expect(getByRole('heading', { name: 'Scenario: Log JSON' })).to.be.visible
      expect(queryByRole('heading', { name: 'Scenario: Log text' })).not.to.exist
    })
  })

  describe('filtering by tag expression', () => {
    it('shows no results based on a tag expression that doesnt match anything', async () => {
      const { getByText } = render(
        <EnvelopesProvider envelopes={hooksConditional}>
          <InMemorySearchProvider defaultQuery="@nonexistent">
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() => {
        expect(getByText('No scenarios match your query and/or filters.')).to.be.visible
      })
    })

    it('matches based on a single tag', async () => {
      const { getByRole, queryByRole } = render(
        <EnvelopesProvider envelopes={hooksConditional}>
          <InMemorySearchProvider defaultQuery="@fail-before">
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() =>
        getByRole('heading', {
          name: 'Scenario: A failure in the before hook and a skipped step',
        })
      )

      expect(
        queryByRole('heading', { name: 'Scenario: A failure in the after hook and a passed step' })
      ).not.to.exist
      expect(queryByRole('heading', { name: 'Scenario: With an tag, a passed step and hook' })).not
        .to.exist
    })

    it('matches based on an or expression', async () => {
      const { getByRole, queryByRole } = render(
        <EnvelopesProvider envelopes={hooksConditional}>
          <InMemorySearchProvider defaultQuery="@fail-before or @fail-after">
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() =>
        getByRole('heading', {
          name: 'Scenario: A failure in the before hook and a skipped step',
        })
      )

      expect(
        getByRole('heading', { name: 'Scenario: A failure in the after hook and a passed step' })
      ).to.be.visible
      expect(queryByRole('heading', { name: 'Scenario: With an tag, a passed step and hook' })).not
        .to.exist
    })

    it('matches based on a negated expression', async () => {
      const { getByRole, queryByRole } = render(
        <EnvelopesProvider envelopes={hooksConditional}>
          <InMemorySearchProvider defaultQuery="not @passing-hook">
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() =>
        getByRole('heading', {
          name: 'Scenario: A failure in the before hook and a skipped step',
        })
      )

      expect(
        getByRole('heading', { name: 'Scenario: A failure in the after hook and a passed step' })
      ).to.be.visible
      expect(queryByRole('heading', { name: 'Scenario: With an tag, a passed step and hook' })).not
        .to.exist
    })

    it('matches based on tags inherited from rule', async () => {
      const { getByRole, queryByRole } = render(
        <EnvelopesProvider envelopes={rules}>
          <InMemorySearchProvider defaultQuery="@some-tag">
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() => getByRole('button', { name: 'samples/rules/rules.feature' }))
      await userEvent.click(getByRole('button', { name: 'samples/rules/rules.feature' }))

      await waitFor(() => getByRole('heading', { name: 'Example: No chocolates left' }))

      // scenario inside rule with @some-tag is shown
      expect(getByRole('heading', { name: 'Example: No chocolates left' })).to.be.visible
      // scenarios inside rule without @some-tag are excluded
      expect(queryByRole('heading', { name: 'Example: Not enough money' })).not.to.exist
      expect(queryByRole('heading', { name: 'Example: Enough money' })).not.to.exist
    })

    it('matches based on tags inherited from examples table', async () => {
      const { getByRole, queryByRole } = render(
        <EnvelopesProvider envelopes={examplesTables}>
          <InMemorySearchProvider defaultQuery="@passing">
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() => getByRole('heading', { name: 'Examples: These are passing' }))

      // examples with @passing tag are shown
      expect(getByRole('heading', { name: 'Then I should have 7 cucumbers' })).to.be.visible
      expect(getByRole('heading', { name: 'Then I should have 15 cucumbers' })).to.be.visible
      // examples with @failing tag (not matching) should not be visible
      expect(queryByRole('heading', { name: 'When I eat 20 cucumbers' })).not.to.exist
      expect(queryByRole('heading', { name: 'When I eat 1 cucumbers' })).not.to.exist
    })
  })

  describe('filtering by status', () => {
    it('filters individual examples within a scenario outline by status', async () => {
      const { getByRole, queryByRole } = render(
        <EnvelopesProvider envelopes={examplesTables}>
          <InMemorySearchProvider defaultHideStatuses={[TestStepResultStatus.FAILED]}>
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() => getByRole('heading', { name: 'Scenario Outline: Eating cucumbers' }))

      // passing examples should be visible
      expect(getByRole('heading', { name: 'Then I should have 7 cucumbers' })).to.be.visible
      expect(getByRole('heading', { name: 'Then I should have 15 cucumbers' })).to.be.visible
      // failing examples should not be visible
      expect(queryByRole('heading', { name: 'When I eat 20 cucumbers' })).not.to.exist
      expect(queryByRole('heading', { name: 'When I eat 1 cucumbers' })).not.to.exist
    })

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
        expect(getByText('No scenarios match your query and/or filters.')).to.be.visible
      })
    })

    it('shows only passed scenarios when other statuses are hidden', async () => {
      const { getByRole, getByText, queryByText } = render(
        <EnvelopesProvider envelopes={retry}>
          <InMemorySearchProvider
            defaultHideStatuses={[
              TestStepResultStatus.FAILED,
              TestStepResultStatus.SKIPPED,
              TestStepResultStatus.PENDING,
              TestStepResultStatus.UNDEFINED,
              TestStepResultStatus.AMBIGUOUS,
            ]}
          >
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() => getByRole('button', { name: 'samples/retry/retry.feature' }))
      await userEvent.click(getByRole('button', { name: 'samples/retry/retry.feature' }))

      await waitFor(() => getByText("Test cases that pass aren't retried"))

      expect(getByText('Test cases that fail are retried if within the --retry limit')).to.be
        .visible
      expect(getByText('Test cases that fail will continue to retry up to the --retry limit')).to.be
        .visible
      expect(queryByText("Test cases won't retry after failing more than the --retry limit")).not.to
        .exist
    })

    it('shows only failed scenarios when other statuses are hidden', async () => {
      const { getByRole, queryByRole, getByText } = render(
        <EnvelopesProvider envelopes={retry}>
          <InMemorySearchProvider
            defaultHideStatuses={[
              TestStepResultStatus.PASSED,
              TestStepResultStatus.SKIPPED,
              TestStepResultStatus.PENDING,
              TestStepResultStatus.UNDEFINED,
              TestStepResultStatus.AMBIGUOUS,
            ]}
          >
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() => getByRole('button', { name: 'samples/retry/retry.feature' }))
      await userEvent.click(getByRole('button', { name: 'samples/retry/retry.feature' }))

      await waitFor(() =>
        getByText("Test cases won't retry after failing more than the --retry limit")
      )

      expect(queryByRole('heading', { name: "Scenario: Test cases that pass aren't retried" })).not
        .to.exist
      expect(
        queryByRole('heading', {
          name: 'Scenario: Test cases that fail are retried if within the --retry limit',
        })
      ).not.to.exist
      expect(
        queryByRole('heading', {
          name: 'Scenario: Test cases that fail will continue to retry up to the --retry limit',
        })
      ).not.to.exist
    })

    it('shows scenarios matching any of multiple statuses', async () => {
      const { getByRole, getByText } = render(
        <EnvelopesProvider envelopes={retry}>
          <InMemorySearchProvider
            defaultHideStatuses={[
              TestStepResultStatus.SKIPPED,
              TestStepResultStatus.PENDING,
              TestStepResultStatus.UNDEFINED,
              TestStepResultStatus.AMBIGUOUS,
            ]}
          >
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() => getByRole('button', { name: 'samples/retry/retry.feature' }))
      await userEvent.click(getByRole('button', { name: 'samples/retry/retry.feature' }))

      await waitFor(() => getByText("Test cases that pass aren't retried"))

      expect(getByText('Test cases that fail are retried if within the --retry limit')).to.be
        .visible
      expect(getByText('Test cases that fail will continue to retry up to the --retry limit')).to.be
        .visible
      expect(getByText("Test cases won't retry after failing more than the --retry limit")).to.be
        .visible
    })

    it('treats scenarios with failed before hooks as failed', async () => {
      const { getByRole, getByText, queryByText } = render(
        <EnvelopesProvider envelopes={hooksConditional}>
          <InMemorySearchProvider
            defaultHideStatuses={[
              TestStepResultStatus.PASSED,
              TestStepResultStatus.SKIPPED,
              TestStepResultStatus.PENDING,
              TestStepResultStatus.UNDEFINED,
              TestStepResultStatus.AMBIGUOUS,
            ]}
          >
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() =>
        getByRole('button', { name: 'samples/hooks-conditional/hooks-conditional.feature' })
      )
      await userEvent.click(
        getByRole('button', { name: 'samples/hooks-conditional/hooks-conditional.feature' })
      )

      await waitFor(() => getByText('A failure in the before hook and a skipped step'))

      expect(getByText('A failure in the after hook and a passed step')).to.be.visible
      expect(queryByText('With an tag, a passed step and hook')).not.to.exist
    })

    it('treats scenarios with failed after hooks as failed', async () => {
      const { getByRole, getByText, queryByText } = render(
        <EnvelopesProvider envelopes={hooksConditional}>
          <InMemorySearchProvider
            defaultHideStatuses={[
              TestStepResultStatus.PASSED,
              TestStepResultStatus.SKIPPED,
              TestStepResultStatus.PENDING,
              TestStepResultStatus.UNDEFINED,
              TestStepResultStatus.AMBIGUOUS,
            ]}
          >
            <FilteredDocuments />
          </InMemorySearchProvider>
        </EnvelopesProvider>
      )

      await waitFor(() =>
        getByRole('button', { name: 'samples/hooks-conditional/hooks-conditional.feature' })
      )
      await userEvent.click(
        getByRole('button', { name: 'samples/hooks-conditional/hooks-conditional.feature' })
      )

      await waitFor(() => getByText('A failure in the after hook and a passed step'))

      expect(getByText('A failure in the before hook and a skipped step')).to.be.visible
      expect(queryByText('With an tag, a passed step and hook')).not.to.exist
    })
  })
})
