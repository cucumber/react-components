import * as messages from '@cucumber/messages'
import React from 'react'

import { HookStep } from './HookStep.js'

interface IProps {
  hookSteps: readonly messages.TestStep[]
}

export const HookSteps: React.FunctionComponent<IProps> = ({ hookSteps }) => {
  return (
    <>
      {hookSteps
        .map((step, index) => <HookStep key={index} step={step} />)
        .filter((el) => !!el.props.children?.length)
        .map((el, index) => (
          <li key={index}>{el}</li>
        ))}
    </>
  )
}
