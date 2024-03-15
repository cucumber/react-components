import { TestStepResult } from '@cucumber/messages'
import React, { FC } from 'react'

import { ErrorMessage } from '../gherkin/index.js'

export const TestStepResultDetails: FC<TestStepResult> = ({ message, exception }) => {
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
