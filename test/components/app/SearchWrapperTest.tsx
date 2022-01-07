import assert from 'assert'
import { JSDOM } from 'jsdom'
import React from 'react'
import ReactDOM from 'react-dom'
import sinon from 'sinon'

import { components } from '../../../src'
import SearchQueryContext, {
  SearchQueryCtx,
  SearchQueryProps,
} from '../../../src/SearchQueryContext'

describe('SearchWrapper', () => {
  function renderSearchWrapper(opts?: SearchQueryProps): {
    document: Document
    searchQueryCapture: sinon.SinonSpy<SearchQueryCtx[]>
  } {
    const dom = new JSDOM('<html lang="en"><body><div id="content"></div></body></html>')
    // @ts-ignore
    global.window = dom.window
    const document = dom.window.document

    const searchQueryCapture = sinon.spy()

    const app = (
      <components.app.SearchWrapper {...opts}>
        <SearchQueryContext.Consumer>
          {(sq) => {
            searchQueryCapture(sq)
            return <div />
          }}
        </SearchQueryContext.Consumer>
      </components.app.SearchWrapper>
    )
    ReactDOM.render(app, document.getElementById('content'))
    return {
      document,
      searchQueryCapture,
    }
  }

  it('creates a search context given no query prop', () => {
    const { searchQueryCapture } = renderSearchWrapper()

    sinon.assert.calledOnce(searchQueryCapture)
    sinon.assert.calledWith(searchQueryCapture, sinon.match.has('query', ''))

    const sq1 = searchQueryCapture.firstCall.args[0]
    searchQueryCapture.resetHistory()

    // When the query is updated
    sq1.update({ query: 'foo' })

    // Then...
    sinon.assert.calledOnce(searchQueryCapture)
    sinon.assert.calledWith(searchQueryCapture, sinon.match.has('query', 'foo'))
  })

  it('creates a search context given a string query prop', () => {
    const { searchQueryCapture } = renderSearchWrapper({ query: 'foo' })

    const sq1 = searchQueryCapture.firstCall.args[0]
    searchQueryCapture.resetHistory()

    assert.strictEqual(sq1.query, 'foo')

    // When the query is updated
    sq1.update({ query: 'bar' })

    // Then...
    sinon.assert.calledOnce(searchQueryCapture)
    sinon.assert.calledWith(searchQueryCapture, sinon.match.has('query', 'bar'))
  })
})
