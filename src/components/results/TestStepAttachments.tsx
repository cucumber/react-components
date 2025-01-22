import { TestStepFinished } from '@cucumber/messages'
import React from 'react'
import { FC } from 'react'

import { useQueries } from '../../hooks/index.js'
import { Attachment } from '../gherkin/index.js'
import styles from './TestStepAttachments.module.scss'

interface Props {
  testStepFinished: TestStepFinished
}

export const TestStepAttachments: FC<Props> = ({ testStepFinished }) => {
  const { cucumberQuery } = useQueries()
  // TODO use new method from https://github.com/cucumber/query/pull/67
  const attachments = cucumberQuery
    .getTestStepsAttachments([testStepFinished.testStepId])
    .filter((attachment) => {
      return attachment.testCaseStartedId === testStepFinished.testCaseStartedId
    })
  return (
    <ol className={styles.attachments}>
      {attachments.map((attachment, index) => {
        return (
          <li key={index}>
            <Attachment attachment={attachment} />
          </li>
        )
      })}
    </ol>
  )
}
