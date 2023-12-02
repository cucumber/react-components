import { TestStepResultStatus as Status } from '@cucumber/messages'
import { expect } from 'chai'
import sinon from 'sinon'

import { searchFromURLParams, SearchQueryCtx } from './SearchQueryContext.js'

describe('SearchQueryCtx', () => {
  it('uses the given values in its initial value', () => {
    const sq = SearchQueryCtx.withDefaults({
      query: 'foo bar',
      hideStatuses: [Status.PASSED],
    })

    expect(sq.query).to.eq('foo bar')
    expect(sq.hideStatuses).to.deep.eq([Status.PASSED])
  })

  it('has a blank initial query by default', () => {
    const sq = SearchQueryCtx.withDefaults({})

    expect(sq.query).to.eq('')
  })

  it('hides no statuses by default', () => {
    const sq = SearchQueryCtx.withDefaults({})

    expect(sq.hideStatuses).to.deep.eq([])
  })

  it('does not change its value on update by default', () => {
    const sq = SearchQueryCtx.withDefaults({ query: 'foo' })

    sq.update({
      query: 'bar',
      hideStatuses: [Status.PASSED],
    })

    expect(sq.query).to.eq('foo')
    expect(sq.hideStatuses).to.deep.eq([])
  })

  it('notifies its listener when the query is updated', () => {
    const onSearchQueryUpdated = sinon.fake()

    const sq = SearchQueryCtx.withDefaults(
      { query: 'bar', hideStatuses: [Status.FAILED] },
      onSearchQueryUpdated
    )

    sq.update({ query: 'foo' })

    expect(onSearchQueryUpdated).to.have.been.calledWith({
      query: 'foo',
      hideStatuses: [Status.FAILED],
    })
  })

  it('notifies its listener when the filters are updated', () => {
    const onSearchQueryUpdated = sinon.fake()

    const sq = SearchQueryCtx.withDefaults({}, onSearchQueryUpdated)

    sq.update({ hideStatuses: [Status.PENDING] })

    expect(onSearchQueryUpdated).to.have.been.calledWith({
      query: '',
      hideStatuses: [Status.PENDING],
    })
  })

  it("notifies its listener when it's updated with blank values", () => {
    const onSearchQueryUpdated = sinon.fake()

    const sq = SearchQueryCtx.withDefaults(
      { query: 'foo', hideStatuses: [Status.FAILED] },
      onSearchQueryUpdated
    )

    sq.update({ query: '', hideStatuses: [] })

    expect(onSearchQueryUpdated).to.have.been.calledWith({
      query: '',
      hideStatuses: [],
    })
  })
})

describe('searchFromURLParams()', () => {
  it('uses the search parameters from the given URL as its initial value', () => {
    const ret = searchFromURLParams({
      querySearchParam: 'foo',
      hideStatusesSearchParam: 'bar',
      windowUrlApi: {
        getURL: () => 'http://example.org/?foo=search%20text&bar=PASSED&bar=FAILED',
        setURL: () => {
          // Do nothing
        },
      },
    })

    expect(ret.query).to.eq('search text')
    expect(ret.hideStatuses).to.deep.eq([Status.PASSED, Status.FAILED])
  })

  it('uses null values when no search parameters are present', () => {
    const ret = searchFromURLParams({
      querySearchParam: 'search',
      hideStatusesSearchParam: 'hide',
      windowUrlApi: {
        getURL: () => 'http://example.org',
        setURL: () => {
          // Do nothing
        },
      },
    })

    expect(ret.query).to.eq(null)
    expect(ret.hideStatuses).to.deep.eq([])
  })

  it('creates an update function that adds parameters to the given URL', () => {
    const setURL = sinon.fake()
    const ret = searchFromURLParams({
      querySearchParam: 'foo',
      hideStatusesSearchParam: 'bar',
      windowUrlApi: {
        getURL: () => 'http://example.org/?foo=search%20text&baz=sausage',
        setURL,
      },
    })

    ret.onSearchQueryUpdated?.({
      query: '@slow',
      hideStatuses: [Status.FAILED, Status.PENDING],
    })

    expect(setURL).to.have.been.calledWith(
      'http://example.org/?foo=%40slow&baz=sausage&bar=FAILED&bar=PENDING'
    )
  })
})
