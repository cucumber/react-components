import { TestStepResult, TestStepResultStatus } from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

import { FailedResult } from './FailedResult.js'

export default {
  title: 'Results/FailedResult',
}

type TemplateArgs = {
  result: TestStepResult
}

const Template: Story<TemplateArgs> = ({ result }) => {
  return <FailedResult {...result} />
}

export const Legacy = Template.bind({})
Legacy.args = {
  result: {
    status: TestStepResultStatus.FAILED,
    message: 'Oh no a bad thing happened!',
  },
}

export const NothingToSee = Template.bind({})
NothingToSee.args = {
  result: {
    status: TestStepResultStatus.PASSED,
  },
}

export const TypedException = Template.bind({})
TypedException.args = {
  result: {
    status: TestStepResultStatus.FAILED,
    message:
      "TypeError: Cannot read properties of null (reading 'type')\n    at TodosPage.addItem (/Users/somebody/Projects/my-project/support/pages/TodosPage.ts:39:21)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at CustomWorld.<anonymous> (/Users/somebody/Projects/my-project/support/steps/steps.ts:20:5)",
    exception: {
      type: 'TypeError',
      message: "Cannot read properties of null (reading 'type')",
    },
  },
}

export const WithStackTrace = Template.bind({})
WithStackTrace.args = {
  result: {
    status: TestStepResultStatus.FAILED,
    message:
      "TypeError: Cannot read properties of null (reading 'type')\n    at TodosPage.addItem (/Users/somebody/Projects/my-project/support/pages/TodosPage.ts:39:21)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at CustomWorld.<anonymous> (/Users/somebody/Projects/my-project/support/steps/steps.ts:20:5)",
    exception: {
      type: 'TypeError',
      message: "Cannot read properties of null (reading 'type')",
      stackTrace:
        "TypeError: Cannot read properties of null (reading 'type')\n    at TodosPage.addItem (/Users/somebody/Projects/my-project/support/pages/TodosPage.ts:39:21)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at CustomWorld.<anonymous> (/Users/somebody/Projects/my-project/support/steps/steps.ts:20:5)",
    },
  },
}
