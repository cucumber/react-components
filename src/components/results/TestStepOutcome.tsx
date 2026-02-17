import {
  type PickleStep,
  type TestStep,
  type TestStepFinished,
  TestStepResultStatus,
} from '@cucumber/messages'
import type { FC } from 'react'

import { useQueries } from '../../hooks/index.js'
import { composeHookStepTitle } from '../gherkin/composeHookStepTitle.js'
import { composePickleStepTitle } from '../gherkin/composePickleStepTitle.js'
import { DataTable, DocString, Keyword, Parameter, StatusIcon } from '../gherkin/index.js'
import { AmbiguousResult } from './AmbiguousResult.js'
import { FailedResult } from './FailedResult.js'
import { PendingResult } from './PendingResult.js'
import { SkippedResult } from './SkippedResult.js'
import { TestStepAttachments } from './TestStepAttachments.js'
import { TestStepDuration } from './TestStepDuration.js'
import styles from './TestStepOutcome.module.scss'
import { UndefinedResult } from './UndefinedResult.js'

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
        {testStepFinished.testStepResult.status === TestStepResultStatus.AMBIGUOUS && (
          <AmbiguousResult testStep={testStep} />
        )}
        {testStepFinished.testStepResult.status === TestStepResultStatus.FAILED && (
          <FailedResult result={testStepFinished.testStepResult} />
        )}
        {testStepFinished.testStepResult.status === TestStepResultStatus.PENDING && (
          <PendingResult result={testStepFinished.testStepResult} />
        )}
        {testStepFinished.testStepResult.status === TestStepResultStatus.SKIPPED && (
          <SkippedResult result={testStepFinished.testStepResult} />
        )}
        {testStepFinished.testStepResult.status === TestStepResultStatus.UNDEFINED && (
          <UndefinedResult testStep={testStep} />
        )}
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
                value={fragment.value}
                parameterTypeName={fragment.parameterTypeName}
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
  }
  if (pickleStep.argument?.dataTable) {
    return <DataTable dataTable={pickleStep.argument.dataTable} />
  }
  return null
}
