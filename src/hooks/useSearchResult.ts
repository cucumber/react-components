import { useEffect, useMemo, useState } from 'react'
import { createSearchIndex, type SearchHits, type SearchIndex } from '../search/index.js'
import { useQueries } from './useQueries.js'
import { useSearch } from './useSearch.js'

/** the search ran - `hits` is an empty map when nothing matched */
export interface SuccessSearchResult {
  status: 'SUCCESS'
  hits: SearchHits
}

/** there was no search term, so no search was done */
export interface NoopSearchResult {
  status: 'NOOP'
}

/** waiting for the index to build or the search to resolve */
export interface WaitingSearchResult {
  status: 'WAITING'
}

/** the index failed to build or the search itself failed */
export interface ErrorSearchResult {
  status: 'ERROR'
  error: Error
}

export type SearchResult =
  | SuccessSearchResult
  | NoopSearchResult
  | WaitingSearchResult
  | ErrorSearchResult

/**
 * Creates and populates a search index from the loaded Gherkin documents, runs the current search
 * term against it, and returns a discriminated result describing the outcome. Consumers narrow on
 * `result.status` and don't need to know whether a search term is present.
 */
export function useSearchResult(): SearchResult {
  const { gherkinQuery } = useQueries()
  const gherkinDocuments = useMemo(() => gherkinQuery.getGherkinDocuments(), [gherkinQuery])
  const { searchTerm } = useSearch()

  const [searchIndex, setSearchIndex] = useState<SearchIndex | Error>()
  const [result, setResult] = useState<SearchResult>({ status: 'WAITING' })

  useEffect(() => {
    createSearchIndex(gherkinDocuments)
      .then((created) => setSearchIndex(created))
      .catch((error) => {
        console.error('Failed to create search index:', error)
        setSearchIndex(new Error('Failed to create search index', { cause: error }))
      })
  }, [gherkinDocuments])
  useEffect(() => {
    if (!searchTerm) {
      setResult({ status: 'NOOP' })
      return
    }
    if (searchIndex === undefined) {
      // search index is not ready yet
      setResult({ status: 'WAITING' })
      return
    }
    if (searchIndex instanceof Error) {
      setResult({ status: 'ERROR', error: searchIndex })
      return
    }
    let active = true
    searchIndex
      .search(searchTerm)
      .then((hits) => {
        if (active) {
          setResult({ status: 'SUCCESS', hits })
        }
      })
      .catch((error) => {
        console.error('Search failed:', error)
        if (active) {
          setResult({ status: 'ERROR', error: new Error('Search failed', { cause: error }) })
        }
      })
    return () => {
      active = false
    }
  }, [searchIndex, searchTerm])

  return result
}
