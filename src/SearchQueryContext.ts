import { TestStepResultStatus as Status } from '@cucumber/messages'
import React, { useState } from 'react'

const defaultQuerySearchParam = 'search'
const defaultHideStatusesSearchParam = 'hide'

const defaultQuery = ''
const defaultHideStatuses: Status[] = []

export interface SearchQueryUpdate {
  readonly query?: string | null
  readonly hideStatuses?: readonly Status[]
}

export interface SearchQuery {
  readonly query: string
  readonly hideStatuses: readonly Status[]
}

export type SearchQueryUpdateFn = (query: SearchQuery) => void

export interface SearchQueryProps extends SearchQueryUpdate {
  onSearchQueryUpdated?: SearchQueryUpdateFn
}

export interface WindowUrlApi {
  getURL: () => string
  setURL: (url: string) => void
}

const defaultWindowUrlApi: WindowUrlApi = {
  getURL: () => window.location.toString(),
  setURL: (url) => window.history.replaceState({}, '', url),
}

export function searchFromURLParams(opts?: {
  querySearchParam?: string
  hideStatusesSearchParam?: string
  windowUrlApi?: WindowUrlApi
}): SearchQueryProps {
  const querySearchParam = opts?.querySearchParam ?? defaultQuerySearchParam
  const hideStatusesSearchParam = opts?.hideStatusesSearchParam ?? defaultHideStatusesSearchParam
  const windowUrlApi = opts?.windowUrlApi ?? defaultWindowUrlApi

  function onSearchQueryUpdated(query: SearchQuery): void {
    const url = new URL(windowUrlApi.getURL())

    if (query.query !== defaultQuery) {
      url.searchParams.set(querySearchParam, query.query)
    } else {
      url.searchParams.delete(querySearchParam)
    }
    url.searchParams.delete(hideStatusesSearchParam)
    query.hideStatuses.forEach((s) => url.searchParams.append(hideStatusesSearchParam, s))

    windowUrlApi.setURL(url.toString())
  }

  const url = new URL(windowUrlApi.getURL())

  return {
    query: url.searchParams.get(querySearchParam),
    hideStatuses: url.searchParams
      .getAll(hideStatusesSearchParam)
      .filter((s) => Object.values(Status).includes(s as Status))
      .map((s) => Status[s as keyof typeof Status]),
    onSearchQueryUpdated,
  }
}

function toSearchQuery(iQuery?: SearchQueryUpdate): SearchQuery {
  return {
    query: iQuery?.query ?? defaultQuery,
    hideStatuses: iQuery?.hideStatuses ?? defaultHideStatuses,
  }
}

export class SearchQueryCtx implements SearchQuery {
  readonly query: string
  readonly hideStatuses: readonly Status[]
  readonly update: (query: SearchQueryUpdate) => void

  constructor(value: SearchQuery, updateValue: SearchQueryUpdateFn) {
    this.query = value.query
    this.hideStatuses = value.hideStatuses
    this.update = (values: SearchQueryUpdate) => {
      updateValue({
        query: values.query ?? this.query,
        hideStatuses: values.hideStatuses ?? this.hideStatuses,
      })
    }
  }

  static withDefaults = (
    value: SearchQueryUpdate = {},
    onSearchQueryUpdated: SearchQueryUpdateFn = () => {
      //Do nothing
    }
  ) => {
    return new SearchQueryCtx(toSearchQuery(value), onSearchQueryUpdated)
  }
}

export function useSearchQueryCtx(props: SearchQueryProps): SearchQueryCtx {
  const [searchQuery, setSearchQuery] = useState(toSearchQuery(props))
  return new SearchQueryCtx(
    searchQuery,
    props.onSearchQueryUpdated
      ? (query) => {
          props.onSearchQueryUpdated && props.onSearchQueryUpdated(query)
          setSearchQuery(query)
        }
      : setSearchQuery
  )
}

export default React.createContext<SearchQueryCtx>(SearchQueryCtx.withDefaults({}))
