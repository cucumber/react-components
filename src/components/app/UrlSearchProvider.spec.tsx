import { TestStepResultStatus } from '@cucumber/messages'
import { act, render } from '@testing-library/react'
import { expect } from 'chai'
import sinon, { type SinonSpy } from 'sinon'

import SearchQueryContext, { type SearchContextValue } from '../../SearchContext.js'
import { UrlSearchProvider } from './UrlSearchProvider.js'

describe('<UrlSearchProvider />', () => {
  function renderAndCapture(): SinonSpy<SearchContextValue[]> {
    const capture = sinon.fake()
    render(
      <UrlSearchProvider>
        <SearchQueryContext.Consumer>
          {(value) => {
            capture(value)
            return <div />
          }}
        </SearchQueryContext.Consumer>
      </UrlSearchProvider>
    )
    return capture
  }

  beforeEach(() => {
    window.history.replaceState({}, '', '/stuff')
  })

  it('initialises with no query string', () => {
    const capture = renderAndCapture()
    expect(capture.firstCall.firstArg.query).to.deep.eq('')
    expect(capture.firstCall.firstArg.hideStatuses).to.deep.eq([])
  })

  it('initialises from query string', () => {
    window.history.replaceState({}, '', '/stuff?query=bar&hide=passed')
    const capture = renderAndCapture()
    expect(capture.firstCall.firstArg.query).to.deep.eq('bar')
    expect(capture.firstCall.firstArg.hideStatuses).to.deep.eq([TestStepResultStatus.PASSED])
  })

  it('updates both values', async () => {
    const capture = renderAndCapture()

    await act(() => {
      capture.firstCall.firstArg.update({
        query: 'foo',
        hideStatuses: [TestStepResultStatus.UNDEFINED, TestStepResultStatus.PENDING],
      })
    })

    expect(window.location.pathname).to.eq('/stuff')
    expect(window.location.search).to.eq('?query=foo&hide=undefined&hide=pending')
    expect(capture.lastCall.firstArg.query).to.eq('foo')
    expect(capture.lastCall.firstArg.hideStatuses).to.deep.eq([
      TestStepResultStatus.UNDEFINED,
      TestStepResultStatus.PENDING,
    ])
  })

  it('updates just the query', async () => {
    const capture = renderAndCapture()

    await act(() => {
      capture.firstCall.firstArg.update({
        query: 'foo',
      })
    })

    expect(window.location.pathname).to.eq('/stuff')
    expect(window.location.search).to.eq('?query=foo')
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

    expect(window.location.pathname).to.eq('/stuff')
    expect(window.location.search).to.eq('?hide=passed')
    expect(capture.lastCall.firstArg.query).to.eq('')
    expect(capture.lastCall.firstArg.hideStatuses).to.deep.eq([TestStepResultStatus.PASSED])
  })
})
