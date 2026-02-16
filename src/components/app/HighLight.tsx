import { stemmer } from '@orama/stemmers/english'
import highlightWords from 'highlight-words'
import React from 'react'
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

export const HighLight: React.FunctionComponent<IProps> = ({
  text,
  markdown = false,
  className = '',
}) => {
  const searchQueryContext = useSearch()
  const query = allQueryWords(
    searchQueryContext.query ? searchQueryContext.query.split(' ') : []
  ).join(' ')
  const appliedClassName = className ? `highlight ${className}` : 'highlight'

  const chunks = highlightWords({ text, query })

  if (markdown) {
    const highlightedText = chunks
      .map(({ text, match }) => (match ? `<mark>${text}</mark>` : text))
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
      {chunks.map(({ text, match, key }) => (match ? <mark key={key}>{text}</mark> : text))}
    </span>
  )
}
