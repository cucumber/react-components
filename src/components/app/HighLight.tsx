import { stemmer } from '@orama/stemmers/english'
import { findAll } from 'highlight-words-core'
import type { FC } from 'react'

import ReactMarkdown from 'react-markdown'

import { useSearch } from '../../hooks/index.js'
import markdownComponents from './markdownComponents.js'
import rehypePlugins from './rehypePlugins.js'
import remarkPlugins from './remarkPlugins.js'

interface IProps {
  text: string
  markdown?: boolean
  className?: string
}

const allQueryWords = (queryWords: string[]): string[] => {
  return queryWords.reduce((allWords, word) => {
    const stem = stemmer(word)
    allWords.push(word)

    if (stem !== word) {
      allWords.push(stem)
    }
    return allWords
  }, [] as string[])
}

export const HighLight: FC<IProps> = ({ text, markdown = false, className = '' }) => {
  const searchQueryContext = useSearch()
  const searchWords = allQueryWords(
    searchQueryContext.query ? searchQueryContext.query.split(' ') : []
  )
  const appliedClassName = className ? `highlight ${className}` : 'highlight'

  const chunks = findAll({ textToHighlight: text, searchWords })

  if (markdown) {
    const highlightedText = chunks
      .map(({ start, end, highlight }) => {
        const chunkText = text.substring(start, end)
        return highlight ? `<mark>${chunkText}</mark>` : chunkText
      })
      .join('')

    return (
      <div className={appliedClassName}>
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          components={markdownComponents}
        >
          {highlightedText}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <span className={appliedClassName}>
      {chunks.map(({ start, end, highlight }) => {
        const chunkText = text.substring(start, end)
        return highlight ? <mark key={start}>{chunkText}</mark> : chunkText
      })}
    </span>
  )
}
