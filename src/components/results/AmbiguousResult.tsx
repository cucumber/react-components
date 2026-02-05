import { TestStep } from '@cucumber/messages'
import React, { FC } from 'react'

import { useQueries } from '../../hooks/index.js'
import styles from './AmbiguousResult.module.scss'
import { SourceReference } from './SourceReference.js'

interface Props {
  testStep: TestStep
}

export const AmbiguousResult: FC<Props> = ({ testStep }) => {
  const { cucumberQuery } = useQueries()
  const stepDefinitions = cucumberQuery.findStepDefinitionsBy(testStep)
  return (
    <>
      <p className={styles.note}>
        <em>Multiple matching step definitions found:</em>
      </p>
      <ul className={styles.definitions}>
        {stepDefinitions.map((stepDefinition) => (
          <li key={stepDefinition.id} className={styles.definition}>
            <code className={styles.pattern}>{stepDefinition.pattern.source}</code>
            <SourceReference sourceReference={stepDefinition.sourceReference} />
          </li>
        ))}
      </ul>
    </>
  )
}
