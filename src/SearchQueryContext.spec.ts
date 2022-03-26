import { TestStepResultStatus as Status } from '@cucumber/messages'

import { searchFromURLParams, SearchQueryCtx } from './SearchQueryContext'

describe('SearchQueryCtx', () => {
  it('uses the given values in its initial value', () => {
    const sq = SearchQueryCtx.withDefaults({
      query: 'foo bar',
      hideStatuses: [Status.PASSED],
    })

    expect(sq.query).toEqual('foo bar')
    expect(sq.hideStatuses).toEqual([Status.PASSED])
  })

  it('has a blank initial query by default', () => {
    const sq = SearchQueryCtx.withDefaults({})

    expect(sq.query).toEqual('')
  })

  it('hides no statuses by default', () => {
    const sq = SearchQueryCtx.withDefaults({})

    expect(sq.hideStatuses).toEqual([])
  })

  it('does not change its value on update by default', () => {
    const sq = SearchQueryCtx.withDefaults({ query: 'foo' })

    sq.update({
      query: 'bar',
      hideStatuses: [Status.PASSED],
    })

    expect(sq.query).toEqual('foo')
    expect(sq.hideStatuses).toEqual([])
  })

  it('notifies its listener when the query is updated', () => {
    const onSearchQueryUpdated = jest.fn()

    const sq = SearchQueryCtx.withDefaults(
      { query: 'bar', hideStatuses: [Status.FAILED] },
      onSearchQueryUpdated
    )

    sq.update({ query: 'foo' })

    expect(onSearchQueryUpdated).toHaveBeenCalledWith({
      query: 'foo',
      hideStatuses: [Status.FAILED],
    })
  })

  it('notifies its listener when the filters are updated', () => {
    const onSearchQueryUpdated = jest.fn()

    const sq = SearchQueryCtx.withDefaults({}, onSearchQueryUpdated)

    sq.update({ hideStatuses: [Status.PENDING] })

    expect(onSearchQueryUpdated).toHaveBeenCalledWith({
      query: '',
      hideStatuses: [Status.PENDING],
    })
  })

  it("notifies its listener when it's updated with blank values", () => {
    const onSearchQueryUpdated = jest.fn()

    const sq = SearchQueryCtx.withDefaults(
      { query: 'foo', hideStatuses: [Status.FAILED] },
      onSearchQueryUpdated
    )

    sq.update({ query: '', hideStatuses: [] })

    expect(onSearchQueryUpdated).toHaveBeenCalledWith({
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

    expect(ret.query).toEqual('search text')
    expect(ret.hideStatuses).toEqual([Status.PASSED, Status.FAILED])
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

    expect(ret.query).toBeNull()
    expect(ret.hideStatuses).toEqual([])
  })

  it('creates an update function that adds parameters to the given URL', () => {
    const setURL = jest.fn()
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

    expect(setURL).toHaveBeenCalledWith(
      'http://example.org/?foo=%40slow&baz=sausage&bar=FAILED&bar=PENDING'
    )
  })
})
