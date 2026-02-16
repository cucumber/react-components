import type { TestStep } from '@cucumber/messages'
import type { FC } from 'react'

import { ensure } from '../../hooks/helpers.js'
import { useQueries } from '../../hooks/index.js'
import { ResultNote } from './ResultNote.js'
import styles from './UndefinedResult.module.scss'

interface Props {
  testStep: TestStep
}

export const UndefinedResult: FC<Props> = ({ testStep }) => {
  const { cucumberQuery } = useQueries()
  const pickleStep = ensure(
    cucumberQuery.findPickleStepBy(testStep),
    'Expected TestStep with UNDEFINED status to have a PickleStep'
  )
  const snippets = cucumberQuery
    .findSuggestionsBy(pickleStep)
    .flatMap((suggestion) => suggestion.snippets)
  if (snippets.length === 0) {
    return <ResultNote>No step definition found.</ResultNote>
  }
  const concatenatedCode = snippets.map((snippet) => snippet.code).join('\n\n')
  return (
    <>
      <ResultNote>No step definition found. Implement with the snippet(s) below:</ResultNote>
      <pre className={styles.snippets}>
        <code>{concatenatedCode}</code>
      </pre>
    </>
  )
}
