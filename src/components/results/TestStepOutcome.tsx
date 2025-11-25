import { PickleStep, TestStep, TestStepFinished } from '@cucumber/messages'
import React, { FC } from 'react'

import { useQueries } from '../../hooks/index.js'
import { composeHookStepTitle } from '../gherkin/composeHookStepTitle.js'
import { composePickleStepTitle } from '../gherkin/composePickleStepTitle.js'
import { DataTable, DocString, Keyword, Parameter, StatusIcon } from '../gherkin/index.js'
import { TestStepAttachments } from './TestStepAttachments.js'
import { TestStepDuration } from './TestStepDuration.js'
import styles from './TestStepOutcome.module.scss'
import { TestStepResultDetails } from './TestStepResultDetails.js'

interface Props {
  testStep: TestStep
  testStepFinished: TestStepFinished
}

export const TestStepOutcome: FC<Props> = ({ testStep, testStepFinished }) => {
  return (
    <li data-status={testStepFinished.testStepResult.status}>
      <div className={styles.header}>
        <div className={styles.status}>
          <StatusIcon status={testStepFinished.testStepResult.status} />
        </div>
        <div className={styles.title}>
          <h3 className={styles.name}>
            {testStep.hookId && <HookStepTitle testStep={testStep} />}
            {testStep.pickleStepId && <PickleStepTitle testStep={testStep} />}
          </h3>
          <TestStepDuration duration={testStepFinished.testStepResult.duration} />
        </div>
      </div>
      <div className={styles.content}>
        {testStep.pickleStepId && <PickleStepArgument testStep={testStep} />}
        <TestStepResultDetails {...testStepFinished.testStepResult} />
        <TestStepAttachments testStepOrHookFinished={testStepFinished} />
      </div>
    </li>
  )
}

const HookStepTitle: FC<{ testStep: TestStep }> = ({ testStep }) => {
  const { cucumberQuery } = useQueries()
  const hook = cucumberQuery.findHookBy(testStep)
  return <>{composeHookStepTitle(hook)}</>
}

const PickleStepTitle: FC<{ testStep: TestStep }> = ({ testStep }) => {
  const { cucumberQuery } = useQueries()
  const pickleStep = cucumberQuery.findPickleStepBy(testStep) as PickleStep
  const step = cucumberQuery.findStepBy(pickleStep)
  return (
    <>
      <Keyword>{step?.keyword?.trim()}</Keyword>
      {composePickleStepTitle(pickleStep.text, testStep.stepMatchArgumentsLists).map(
        (fragment, index) => {
          if (fragment.parameterTypeName) {
            return (
              <Parameter
                key={index}
                parameterTypeName={fragment.parameterTypeName}
                value={fragment.value}
              >
                {fragment.value}
              </Parameter>
            )
          }
          return <span key={index}>{fragment.value}</span>
        }
      )}
    </>
  )
}

const PickleStepArgument: FC<{ testStep: TestStep }> = ({ testStep }) => {
  const { cucumberQuery } = useQueries()
  const pickleStep = cucumberQuery.findPickleStepBy(testStep) as PickleStep
  if (pickleStep.argument?.docString) {
    return <DocString docString={pickleStep.argument.docString} />
  } else if (pickleStep.argument?.dataTable) {
    return <DataTable dataTable={pickleStep.argument.dataTable} />
  }
  return null
}
