import { TestStepResult, TestStepResultStatus } from '@cucumber/messages'
import React, { FC } from 'react'

import { ErrorMessage } from '../gherkin/index.js'

export const TestStepResultDetails: FC<TestStepResult> = ({ status, message, exception }) => {
  if (status !== TestStepResultStatus.FAILED) {
    return null
  }
  if (exception?.stackTrace) {
    return <ErrorMessage>{exception.stackTrace}</ErrorMessage>
  }
  if (exception) {
    return (
      <ErrorMessage>
        <strong>{exception.type}</strong> {exception.message}
      </ErrorMessage>
    )
  }
  if (message) {
    return <ErrorMessage>{message}</ErrorMessage>
  }
  return null
}
