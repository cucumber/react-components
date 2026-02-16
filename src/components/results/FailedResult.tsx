import type { TestStepResult } from '@cucumber/messages'
import React, { type FC } from 'react'

import { ErrorMessage } from '../gherkin/index.js'

interface Props {
  result: TestStepResult
}

export const FailedResult: FC<Props> = ({ result: { exception, message } }) => {
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
