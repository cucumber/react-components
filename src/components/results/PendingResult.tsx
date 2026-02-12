import { TestStepResult } from '@cucumber/messages'
import React, { FC } from 'react'

import { ResultNote } from './ResultNote.js'

interface Props {
  result: TestStepResult
}

export const PendingResult: FC<Props> = ({ result: { exception } }) => {
  if (exception?.message) {
    return <ResultNote>{exception.message}</ResultNote>
  }
  return null
}
