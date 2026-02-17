import { TestStepResultStatus } from '@cucumber/messages'
import { act, render } from '@testing-library/react'
import { expect } from 'chai'
import sinon, { type SinonSpy } from 'sinon'

import SearchQueryContext, { type SearchContextValue } from '../../SearchContext.js'
import { InMemorySearchProvider } from './InMemorySearchProvider.js'

describe('<InMemorySearchProvider />', () => {
  function renderAndCapture({
    defaultQuery,
    defaultHideStatuses,
  }: {
    defaultQuery?: string
    defaultHideStatuses?: readonly TestStepResultStatus[]
  } = {}): SinonSpy<SearchContextValue[]> {
    const capture = sinon.fake()
    render(
      <InMemorySearchProvider defaultQuery={defaultQuery} defaultHideStatuses={defaultHideStatuses}>
        <SearchQueryContext.Consumer>
          {(value) => {
            capture(value)
            return <div />
          }}
        </SearchQueryContext.Consumer>
      </InMemorySearchProvider>
    )
    return capture
  }

  it('initialises with noop values', () => {
    const capture = renderAndCapture()
    expect(capture.firstCall.firstArg.query).to.deep.eq('')
    expect(capture.firstCall.firstArg.hideStatuses).to.deep.eq([])
  })

  it('initialises with defaults', () => {
    const capture = renderAndCapture({
      defaultQuery: 'bar',
      defaultHideStatuses: [TestStepResultStatus.PASSED],
    })
    expect(capture.firstCall.firstArg.query).to.deep.eq('bar')
    expect(capture.firstCall.firstArg.hideStatuses).to.deep.eq([TestStepResultStatus.PASSED])
  })

  it('updates both values', async () => {
    const capture = renderAndCapture()

    await act(() => {
      capture.firstCall.firstArg.update({
        query: 'foo',
        hideStatuses: [TestStepResultStatus.PASSED],
      })
    })

    expect(capture.lastCall.firstArg.query).to.eq('foo')
    expect(capture.lastCall.firstArg.hideStatuses).to.deep.eq([TestStepResultStatus.PASSED])
  })

  it('updates just the query', async () => {
    const capture = renderAndCapture()

    await act(() => {
      capture.firstCall.firstArg.update({
        query: 'foo',
      })
    })

    expect(capture.lastCall.firstArg.query).to.eq('foo')
    expect(capture.lastCall.firstArg.hideStatuses).to.deep.eq([])
  })

  it('updates just the hideStatuses', async () => {
    const capture = renderAndCapture()

    await act(() => {
      capture.firstCall.firstArg.update({
        hideStatuses: [TestStepResultStatus.PASSED],
      })
    })

    expect(capture.lastCall.firstArg.query).to.eq('')
    expect(capture.lastCall.firstArg.hideStatuses).to.deep.eq([TestStepResultStatus.PASSED])
  })
})
