import * as messages from '@cucumber/messages'
import { getWorstTestStepResult } from '@cucumber/messages'
import React from 'react'

import CucumberQueryContext from '../../CucumberQueryContext'
import { HookStepProps, useCustomRendering } from '../customise'
import { Attachment } from './Attachment'
import { ErrorMessage } from './ErrorMessage'
import { StepItem } from './StepItem'
import { Title } from './Title'

const DefaultRenderer: React.FunctionComponent<HookStepProps> = ({ step }) => {
  if (!step.hookId) throw new Error('Expected step to have a hookId')
  const cucumberQuery = React.useContext(CucumberQueryContext)

  const stepResult = getWorstTestStepResult(cucumberQuery.getTestStepResults(step.id))

  const hook = cucumberQuery.getHook(step.hookId)
  const attachments = cucumberQuery.getTestStepsAttachments([step.id])

  if (stepResult.status === messages.TestStepResultStatus.FAILED) {
    let location = 'Unknown location'
    if (hook?.sourceReference.location) {
      location = `${hook.sourceReference.uri}:${hook.sourceReference.location.line}`
    } else if (hook?.sourceReference.javaMethod) {
      location = `${hook.sourceReference.javaMethod.className}.${hook.sourceReference.javaMethod.methodName}`
    }

    return (
      <StepItem status={stepResult.status}>
        <Title header="h3" id={step.id}>
          Hook failed: {location}
        </Title>
        {stepResult.message && <ErrorMessage message={stepResult.message} />}
        {attachments.map((attachment, i) => (
          <Attachment key={i} attachment={attachment} />
        ))}
      </StepItem>
    )
  }

  if (attachments) {
    return (
      <StepItem>
        {attachments.map((attachment, i) => (
          <Attachment key={i} attachment={attachment} />
        ))}
      </StepItem>
    )
  }
  return null
}

export const HookStep: React.FunctionComponent<HookStepProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<HookStepProps>('HookStep', {}, DefaultRenderer)
  return <ResolvedRenderer {...props} />
}
