import { render } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils'

import SearchQueryContext, { SearchQueryCtx, SearchQueryProps } from '../../SearchQueryContext'
import { SearchWrapper } from './SearchWrapper'

describe('SearchWrapper', () => {
  function renderSearchWrapper(opts?: SearchQueryProps): ReturnType<typeof render> & {
    searchQueryCapture: jest.Mock<SearchQueryCtx[]>
  } {
    const searchQueryCapture = jest.fn()
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

    expect(searchQueryCapture).toHaveBeenCalledTimes(1)
    expect(searchQueryCapture.mock.calls[0][0].query).toEqual('')

    const sq1 = searchQueryCapture.mock.calls[0][0]
    searchQueryCapture.mockReset()

    act(() => {
      // When the query is updated
      sq1.update({ query: 'foo' })
    })

    // Then...
    expect(searchQueryCapture).toHaveBeenCalledTimes(1)
    expect(searchQueryCapture.mock.calls[0][0].query).toEqual('foo')
  })

  it('creates a search context given a string query prop', () => {
    const { searchQueryCapture } = renderSearchWrapper({ query: 'foo' })

    const sq1 = searchQueryCapture.mock.calls[0][0]
    searchQueryCapture.mockReset()

    expect(sq1.query).toEqual('foo')

    act(() => {
      // When the query is updated
      sq1.update({ query: 'bar' })
    })

    // Then...
    expect(searchQueryCapture).toHaveBeenCalledTimes(1)
    expect(searchQueryCapture.mock.calls[0][0].query).toEqual('bar')
  })
})
