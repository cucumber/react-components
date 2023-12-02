import { act, render } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'
import sinon, { SinonSpy } from 'sinon'

import SearchQueryContext, { SearchQueryCtx, SearchQueryProps } from '../../SearchQueryContext.js'
import { SearchWrapper } from './SearchWrapper.js'

describe('SearchWrapper', () => {
  function renderSearchWrapper(opts?: SearchQueryProps): ReturnType<typeof render> & {
    searchQueryCapture: SinonSpy<SearchQueryCtx[]>
  } {
    const searchQueryCapture = sinon.fake()
    const app = render(
      <SearchWrapper {...opts}>
        <SearchQueryContext.Consumer>
          {(sq) => {
            searchQueryCapture(sq)
            return <div />
          }}
        </SearchQueryContext.Consumer>
      </SearchWrapper>
    )
    return {
      ...app,
      searchQueryCapture,
    }
  }

  it('creates a search context given no query prop', () => {
    const { searchQueryCapture } = renderSearchWrapper()

    expect(searchQueryCapture).to.have.been.calledOnce
    expect(searchQueryCapture.firstCall.firstArg.query).to.eq('')

    const sq1 = searchQueryCapture.firstCall.firstArg
    searchQueryCapture.resetHistory()

    act(() => {
      // When the query is updated
      sq1.update({ query: 'foo' })
    })

    // Then...
    expect(searchQueryCapture).to.have.been.calledOnce
    expect(searchQueryCapture.firstCall.firstArg.query).to.eq('foo')
  })

  it('creates a search context given a string query prop', () => {
    const { searchQueryCapture } = renderSearchWrapper({ query: 'foo' })

    const sq1 = searchQueryCapture.firstCall.firstArg
    searchQueryCapture.resetHistory()

    expect(sq1.query).to.eq('foo')

    act(() => {
      // When the query is updated
      sq1.update({ query: 'bar' })
    })

    // Then...
    expect(searchQueryCapture).to.have.been.calledOnce
    expect(searchQueryCapture.firstCall.firstArg.query).to.eq('bar')
  })
})
