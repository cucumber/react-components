import { TestStepResult, TestStepResultStatus } from '@cucumber/messages'
import React, { FC } from 'react'

import { ErrorMessage } from '../gherkin/index.js'

export const TestStepResultDetails: FC<TestStepResult> = ({ status, message, exception }) => {
  if (status !== TestStepResultStatus.FAILED) {
    return null
  }
  if (exception) {
    return (
      <ErrorMessage>
        <strong>{exception.type}</strong> {exception.message}
        {exception.stackTrace && <div>{exception.stackTrace}</div>}
      </ErrorMessage>
    )
  }
  if (message) {
    return <ErrorMessage>{message}</ErrorMessage>
  }
  return null
}
