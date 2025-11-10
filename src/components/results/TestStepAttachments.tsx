import { TestRunHookFinished, TestStepFinished } from '@cucumber/messages'
import React from 'react'
import { FC } from 'react'

import { useQueries } from '../../hooks/index.js'
import { Attachment } from '../gherkin/index.js'
import styles from './TestStepAttachments.module.scss'

interface Props {
  testStepOrHookFinished: TestStepFinished | TestRunHookFinished
}

export const TestStepAttachments: FC<Props> = ({ testStepOrHookFinished }) => {
  const { cucumberQuery } = useQueries()
  const attachments = cucumberQuery.findAttachmentsBy(testStepOrHookFinished)
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
