import { TestStepResult } from '@cucumber/messages'
import React, { FC } from 'react'

import { ResultNote } from './ResultNote.js'

interface Props {
  result: TestStepResult
}

export const PendingResult: FC<Props> = ({ result: { exception, message }  }) => {
  if (exception?.message) {
    return <ResultNote>{exception.message}</ResultNote>
  }
  if (message) {
    return <ResultNote>{message}</ResultNote>
  }
  return null
}
