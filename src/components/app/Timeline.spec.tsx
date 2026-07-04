import { type Envelope, type TestCaseStarted, TestStepResultStatus } from '@cucumber/messages'
import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'

import examplesTablesFeature from '../../../acceptance/examples-tables/examples-tables.js'
import { ControlledSearchProvider } from './ControlledSearchProvider.js'
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { Timeline } from './Timeline.js'

describe('<Timeline/>', () => {
  it('should show a message when no scenarios were executed', () => {
    render(
      <EnvelopesProvider envelopes={[]}>
        <ControlledSearchProvider value={{ query: '', hideStatuses: [] }} onChange={() => {}}>
          <Timeline />
        </ControlledSearchProvider>
      </EnvelopesProvider>
    )

    expect(screen.getByText('No scenarios were executed.')).to.be.visible
  })

  it('should show a message when filters exclude every scenario', () => {
    render(
      <EnvelopesProvider envelopes={examplesTablesFeature}>
        <ControlledSearchProvider
          value={{
            query: '',
            hideStatuses: [TestStepResultStatus.PASSED, TestStepResultStatus.FAILED],
          }}
          onChange={() => {}}
        >
          <Timeline />
        </ControlledSearchProvider>
      </EnvelopesProvider>
    )

    expect(screen.getByText('No scenarios match your query and/or filters.')).to.be.visible
  })

  it('should render one bar per executed scenario, in a single lane when no worker information is present', () => {
    render(
      <EnvelopesProvider envelopes={examplesTablesFeature}>
        <ControlledSearchProvider value={{ query: '', hideStatuses: [] }} onChange={() => {}}>
          <Timeline />
        </ControlledSearchProvider>
      </EnvelopesProvider>
    )

    expect(screen.getByText('Main process')).to.be.visible
    expect(screen.getAllByRole('button')).to.have.length(7)
  })

  it('should respect the hideStatuses filter from the shared search context', () => {
    render(
      <EnvelopesProvider envelopes={examplesTablesFeature}>
        <ControlledSearchProvider
          value={{ query: '', hideStatuses: [TestStepResultStatus.FAILED] }}
          onChange={() => {}}
        >
          <Timeline />
        </ControlledSearchProvider>
      </EnvelopesProvider>
    )

    expect(screen.getAllByRole('button')).to.have.length(5)
  })

  it('should respect a tag expression from the shared search context', () => {
    render(
      <EnvelopesProvider envelopes={examplesTablesFeature}>
        <ControlledSearchProvider
          value={{ query: '@passing', hideStatuses: [] }}
          onChange={() => {}}
        >
          <Timeline />
        </ControlledSearchProvider>
      </EnvelopesProvider>
    )

    expect(screen.getAllByRole('button')).to.have.length(2)
  })

  it('should group test cases by worker id, sorted numerically', () => {
    render(
      <EnvelopesProvider envelopes={distributeAcrossWorkers(examplesTablesFeature, 2)}>
        <ControlledSearchProvider value={{ query: '', hideStatuses: [] }} onChange={() => {}}>
          <Timeline />
        </ControlledSearchProvider>
      </EnvelopesProvider>
    )

    expect(screen.getAllByTestId('cucumber.timeline.group')).to.have.length(2)
    expect(screen.getByText('Worker 0')).to.be.visible
    expect(screen.getByText('Worker 1')).to.be.visible
  })

  it('should show scenario details when a bar is selected, and hide them again on close', async () => {
    render(
      <EnvelopesProvider envelopes={examplesTablesFeature}>
        <ControlledSearchProvider value={{ query: '', hideStatuses: [] }} onChange={() => {}}>
          <Timeline />
        </ControlledSearchProvider>
      </EnvelopesProvider>
    )

    expect(screen.queryByTestId('cucumber.timeline.detail')).to.be.null

    await userEvent.click(screen.getByRole('button', { name: 'Eating cucumbers with 11 friends' }))

    const detail = screen.getByTestId('cucumber.timeline.detail')
    expect(within(detail).getByText('Eating cucumbers with 11 friends')).to.be.visible
    expect(within(detail).getByText('Examples Tables')).to.be.visible

    await userEvent.click(within(detail).getByRole('button', { name: 'Close' }))

    expect(screen.queryByTestId('cucumber.timeline.detail')).to.be.null
  })
})

function distributeAcrossWorkers(
  envelopes: ReadonlyArray<Envelope>,
  workerCount: number
): ReadonlyArray<Envelope> {
  let index = 0
  return envelopes.map((envelope): Envelope => {
    if (!envelope.testCaseStarted) {
      return envelope
    }
    const workerId = String(index % workerCount)
    index += 1
    const testCaseStarted: TestCaseStarted = { ...envelope.testCaseStarted, workerId }
    return { ...envelope, testCaseStarted }
  })
}
